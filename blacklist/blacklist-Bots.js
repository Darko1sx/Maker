
  const { Client, Collection,AuditLogEvent, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const blacklistDB = new Database("/Json-db/Bots/blacklistDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


let blacklist = tokens.get('blacklist')
if(!blacklist) return;
const path = require('path');
const { readdirSync } = require("fs");
let theowner;
blacklist.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client8 = new Client({intents: 131071, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client8.commands = new Collection();
  require(`./handlers/events`)(client8);
  client8.events = new Collection();
  client8.setMaxListeners(1000)

  require(`../../events/requireBots/blacklist-commands`)(client8);
  const rest = new REST({ version: '10' }).setToken(token);
  client8.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client8.user.id),
          { body: blacklistSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client8.once('ready', () => {
    client8.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`blacklist bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client8.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`blacklist`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client8.users.cache.get(owner) || await client8.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : بلاك ليست\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`blacklist`, filtered);
          await client8.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`./handlers/events`)(client8)
  const folderPath = path.join(__dirname, 'slashcommand8');
  client8.blacklistSlashCommands = new Collection();
  const blacklistSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("blacklist commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          blacklistSlashCommands.push(command.data.toJSON());
          client8.blacklistSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand8');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/blacklist-commands`)(client8)
require("./handlers/events")(client8)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client8.once(event.name, (...args) => event.execute(...args));
	} else {
		client8.on(event.name, (...args) => event.execute(...args));
	}
	}




  client8.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client8.blacklistSlashCommands.get(interaction.commandName);
	    
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




  client8.on('guildMemberAdd' , async(member) => {
    const dataFind = blacklistDB.get(`blacklisted_${member.guild.id}`)
    if(dataFind) {
      if(!dataFind.includes(member.user.id)) return;
      const roleFind = blacklistDB.get(`blacklist_role_${member.guild.id}`)
      if(roleFind) {
        try {
          member.roles.add(roleFind)
        } catch {
          return;
        }
      }
    }
  })
  client8.on("guildMemberAdd" , async(member) => {
    const guild = member.guild;
    let dataFind = blacklistDB.get(`blacklisted_${guild.id}`)
    if(!dataFind) {
      await blacklistDB.set(`blacklisted_${guild.id}` , [])
    }
    dataFind = blacklistDB.get(`blacklisted_${guild.id}`)
    const roleFind = blacklistDB.get(`blacklist_role_${guild.id}`)
    if(!roleFind) {
      return;
    }
    if(dataFind.includes(member.user.id)) {
      await member.roles.add(roleFind)
    }
  } )

  client8.on('guildMemberUpdate', async (oldMember, newMember) => {
    const guild = oldMember.guild;
    const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0 && blacklistDB.get(`blacklist_role_${guild.id}`)) {
      let roleRemoveLog1 = blacklistDB.get(`blacklist_role_${guild.id}`)
      
      removedRoles.forEach(async(role) => {
        let dataFind = blacklistDB.get(`blacklisted_${guild.id}`)
        if(!dataFind) {
          await blacklistDB.set(`blacklisted_${guild.id}` , [])
        }
        dataFind = blacklistDB.get(`blacklisted_${guild.id}`)
        const roleFind = blacklistDB.get(`blacklist_role_${guild.id}`)
        if(!roleFind) {
          return;
        }
        if(dataFind.includes(newMember.user.id)) {
          await newMember.roles.add(roleFind)
        }
      });
    }
  });


  client8.on("interactionCreate" , async(interaction) => {
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
        {name : `\`/set-blacklist-role\`` , value : `لتحديد رتبة البلاك ليست`},
        {name : `\`/blacklist\`` , value : `لاعطاء او ازالة بلاك ليست`},
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

   client8.login(token)
   .catch(async(err) => {
    const filtered = blacklist.filter(bo => bo != data)
			await tokens.set(`blacklist` , filtered)
      console.log(`${clientId} Not working and removed `)
   });
})