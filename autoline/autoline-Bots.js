
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message, Attachment } = require("discord.js");
const { Database } = require("st.db")
const autolineDB = new Database("/Json-db/Bots/autolineDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


let autoline = tokens.get('autoline')
if(!autoline) return;
const path = require('path');
const { readdirSync } = require("fs");
let theowner;
autoline.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client10 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client10.commands = new Collection();
  require(`./handlers/events`)(client10);
  client10.events = new Collection();
  require(`../../events/requireBots/autoline-commands`)(client10);
  const rest = new REST({ version: '10' }).setToken(token);
  client10.setMaxListeners(1000)

  client10.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client10.user.id),
          { body: autolineSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
          
        }

    });
        client10.once('ready', () => {

    client10.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`autoline bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client10.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`autoline`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client10.users.cache.get(owner) || await client10.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : خط تلقائي\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`autoline`, filtered);
          await client10.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`../autoline/handlers/events`)(client10)

  const folderPath = path.join(__dirname, 'slashcommand10');
  client10.autolineSlashCommands = new Collection();
  const autolineSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("autoline commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          autolineSlashCommands.push(command.data.toJSON());
          client10.autolineSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand10');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/autoline-commands`)(client10)
require("./handlers/events")(client10)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client10.once(event.name, (...args) => event.execute(...args));
	} else {
		client10.on(event.name, (...args) => event.execute(...args));
	}
	}




  client10.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client10.autolineSlashCommands.get(interaction.commandName);
	    
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
        return;
		}
    }
  } )




client10.on("messageCreate" , async(message) => {
  if(message.author.bot) return;
  try {
    if(message.content == "-" || message.content == "خط") {
      const line = autolineDB.get(`line_${message.guild.id}`)
      if(line && message.member.permissions.has('ManageMessages')) {
        await message.delete()
        return message.channel.send({content:`${line}`});
      }else{
        return;
      }
    }
  } catch (error) {
    return;
  }
 
})

client10.on("messageCreate" , async(message) => {
  if(message.author.bot) return;
  const autoChannels = autolineDB.get(`line_channels_${message.guild.id}`)
    if(autoChannels) {
      if(autoChannels.length > 0) {
        if(autoChannels.includes(message.channel.id)) {
          const line = autolineDB.get(`line_${message.guild.id}`)
      if(line) {
        return message.channel.send({content:`${line}`});
        }
      }
      }
    }
})

client10.on("interactionCreate" , async(interaction) => {
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
      {name : `\`/set-line\`` , value : `لتحديد الخط`},
      {name : `\`/add-autoline-channel\`` , value : `لاضافة روم خط تلقائي`},
      {name : `\`/remove-autoline-channel\`` , value : `لازالة روم خط تلقائي`},
      {name : `\`خط\` | \`-\`` , value : `لارسال خط`},
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



   client10.login(token)
   .catch(async(err) => {
    const filtered = autoline.filter(bo => bo != data)
			await tokens.set(`autoline` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
