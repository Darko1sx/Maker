
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const nadekoDB = new Database("/Json-db/Bots/nadekoDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


let nadeko = tokens.get('nadeko')
if(!nadeko) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
nadeko.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client15 =new Client({intents: 131071, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client15.commands = new Collection();
  require(`./handlers/events`)(client15);
  client15.events = new Collection();
  client15.setMaxListeners(1000)

  require(`../../events/requireBots/nadeko-commands`)(client15);
  const rest = new REST({ version: '10' }).setToken(token);
  client15.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client15.user.id),
          { body: nadekoSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client15.once('ready', () => {
    client15.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`apply bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client15.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`nadeko`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client15.users.cache.get(owner) || await client15.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : ناديكو\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`nadeko`, filtered);
          await client15.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`../nadeko/handlers/events`)(client15)

  const folderPath = path.join(__dirname, 'slashcommand15');
  client15.nadekoSlashCommands = new Collection();
  const nadekoSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("nadeko commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          nadekoSlashCommands.push(command.data.toJSON());
          client15.nadekoSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand15');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/nadeko-commands`)(client15)
require("./handlers/events")(client15)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client15.once(event.name, (...args) => event.execute(...args));
	} else {
		client15.on(event.name, (...args) => event.execute(...args));
	}
	}



client15.on("guildMemberAdd" , async(member) => {
  const theeGuild = member.guild
  let rooms = nadekoDB.get(`rooms_${theeGuild.id}`)
  const message = nadekoDB.get(`message_${theeGuild.id}`)
  if(!rooms) return;
  if(rooms.length <= 0) return;
  if(!message) return;
  await rooms.forEach(async(room) => {
    const theRoom = await theeGuild.channels.cache.find(ch => ch.id == room)
    if(!theRoom) return;
    await theRoom.send({content:`${member} - ${message}`}).then(async(msg) => {
      setTimeout(() => {
        msg.delete();
      }, 3000);
    })
  })
})

client15.on("interactionCreate" , async(interaction) => {
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
      {name : `\`/set-message\`` , value : `لتحديد الرسالة عند الدخول`},
      {name : `\`/add-nadeko-room\`` , value : `لاضافة روم يتم تفعيل الخاصية فيها`},
      {name : `\`/remove-nadeko-room\`` , value : `لازالة روم مفعل الخاصية فيها`},
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

  client15.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client15.nadekoSlashCommands.get(interaction.commandName);
	    
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



   client15.login(token)
   .catch(async(err) => {
    const filtered = nadeko.filter(bo => bo != data)
			await tokens.set(`nadeko` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
