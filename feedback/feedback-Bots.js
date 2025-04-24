
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message, Attachment } = require("discord.js");
const { Database } = require("st.db")
const feedbackDB = new Database("/Json-db/Bots/feedbackDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


let feedback = tokens.get('feedback')
if(!feedback) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
feedback.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client11 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client11.commands = new Collection();
  require(`./handlers/events`)(client11);
  client11.events = new Collection();
  require(`../../events/requireBots/feedback-commands`)(client11);
  const rest = new REST({ version: '10' }).setToken(token);
  client11.setMaxListeners(1000)

  client11.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client11.user.id),
          { body: feedbackSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client11.once('ready', () => {
    client11.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`feedback bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client11.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`feedback`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client11.users.cache.get(owner) || await client11.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : فيدباك\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`feedback`, filtered);
          await client11.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`./handlers/events`)(client11)

  const folderPath = path.join(__dirname, 'slashcommand11');
  client11.feedbackSlashCommands = new Collection();
  const feedbackSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("feedback commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          feedbackSlashCommands.push(command.data.toJSON());
          client11.feedbackSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand11');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/feedback-commands`)(client11)
require("./handlers/events")(client11)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client11.once(event.name, (...args) => event.execute(...args));
	} else {
		client11.on(event.name, (...args) => event.execute(...args));
	}
	}



  client11.on("messageCreate" , async(message) => {
    const line = feedbackDB.get(`line_${message.guild.id}`)
    const chan = feedbackDB.get(`feedback_room_${message.guild.id}`)
    if(chan && chan == message.channel.id) {
      if(message.author.bot)return;
      if(message.content.length > 256)return message.delete();
      const embed = new EmbedBuilder()
      .setTimestamp()
      .setTitle(`** > ${message.content} **`)
      .setAuthor({name:message.guild.name , iconURL:message.guild.iconURL({dynamic:true})})
      .setThumbnail(message.author.displayAvatarURL({dynamic : true}))
      .setColor('Random');
      await message.delete()
      const themsg = await message.channel.send({content : `**<@${message.author.id}> شكرا لمشاركتنا رأيك :tulip: **`, embeds:[embed]})
      await themsg.react("❤")
      await themsg.react("❤️‍🔥")
      if(line){
        await message.channel.send({content:`${line}`})
      }
    }
  })
  client11.on("interactionCreate" , async(interaction) => {
    if(interaction.customId === "help_general"){
      const embed = new EmbedBuilder()
          .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
          .setTitle('قائمة اوامر البوت')
          .setDescription('**لا توجد اوامر في هذا القسم حاليا**')
          .setTimestamp()
          .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
          .setColor('DarkButNotBlack');
      const btns = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐').setDisabled(true),
          new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Primary).setEmoji('👑'),
      )
  
      await interaction.update({embeds : [embed] , components : [btns]})
    }else if(interaction.customId === "help_owner"){
      const embed = new EmbedBuilder()
      .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
      .setTitle('قائمة اوامر البوت')
      .addFields(
        {name : `\`/set-line\`` , value : `لتحديد خط الاراء`},
        {name : `\`/set-feedback-room\`` , value : `لتحديد روم الاراء`},
      )
      .setTimestamp()
      .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
      .setColor('DarkButNotBlack');
  const btns = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐'),
      new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Primary).setEmoji('👑').setDisabled(true),
  )
  
  await interaction.update({embeds : [embed] , components : [btns]})
    }
  })
  client11.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client11.feedbackSlashCommands.get(interaction.commandName);
	    
      if (!command) {
        return;
      }
      if (command.ownersOnly === true) {
        if (owner != interaction.user.id) {
          return interaction.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
        }
      }
      try {

        await command.execute(interaction);
      } catch (error) {
			return
		}
    }
  } )

   client11.login(token)
   .catch(async(err) => {
    const filtered = feedback.filter(bo => bo != data)
			await tokens.set(`feedback` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
