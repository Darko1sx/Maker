
const { Client, Collection,ChannelType ,SlashCommandBuilder, GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder , ButtonStyle , Message, Embed,PermissionsBitField } = require("discord.js")
const { Database } = require("st.db")
const azkarDB = new Database("/Json-db/Bots/azkarDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


let moment = require('moment');
const ms = require("ms")
const buyCooldown = new Collection()
let azkar = tokens.get('azkar')
if(!azkar) return;

const path = require('path');
const { readdirSync } = require("fs");
const client = require("../../index.js")
let theowner;
azkar.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client23 = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  module.exports = client23
  exports.azkarBot = client23;
  client23.commands = new Collection();
  client23.setMaxListeners(1000)
  
  require(`./handlers/events.js`)(client23);
  client23.events = new Collection();
  require(`../../events/requireBots/azkar-commands.js`)(client23);
  const rest = new REST({ version: '10' }).setToken(token);
  client23.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client23.user.id),
          { body: azkarSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client23.once('ready', () => {
    client23.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`azkar bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});

      //------------- التحقق من وقت البوت --------------//
  client23.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`azkar`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client23.users.cache.get(owner) || await client23.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : اذكار\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`azkar`, filtered);
          await client23.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });

  require(`./handlers/events.js`)(client23)
  const folderPath = path.join(__dirname, 'slashcommand23');
  client23.azkarSlashCommands = new Collection();
  const azkarSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("azkar commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          azkarSlashCommands.push(command.data.toJSON());
          client23.azkarSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}

let commandsDir2 = path.join(__dirname);
client23.commands = new Collection()
const commands = [];
const table2 = new ascii('Prefix Commands').setJustify();
for (let folder of readdirSync(commandsDir2+`/slashcommand23`).filter(f => f.endsWith(`.js`))) {
	  let command = require(`${commandsDir2}/slashcommand23/${folder}`);
	  if(command) {
		commands.push(command);
  client23.commands.set(command.name, command);
		  if(command.name) {
			  table2.addRow(`${prefix}${command.name}` , '🟢 Working')
		  }
		  if(!command.name) {
			  table2.addRow(`${prefix}${command.name}` , '🔴 Not Working')
		  }
	  }
}


require(`../../events/requireBots/azkar-commands.js`)(client23)
require("./handlers/events.js")(client23)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client23.once(event.name, (...args) => event.execute(...args));
	} else {
		client23.on(event.name, (...args) => event.execute(...args));
	}
	}

client23.on("messageCreate" , async(message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if(!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g); 
  const cmd = args.shift().toLowerCase();
  if(cmd.length == 0 ) return;
    if(!client23.commands.has(cmd)) return;
  let command = client23.commands.get(cmd)
  if(!command) command = client23.commands.get(client23.commandaliases.get(cmd));

  if(command) {
    if(command.cooldown) {
        
      if(cooldown.has(`${command.name}${message.author.id}`)) return message.reply({ embeds:[{description:`**عليك الانتظار\`${ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true}).replace("minutes", `دقيقة`).replace("seconds", `ثانية`).replace("second", `ثانية`).replace("ms", `ملي ثانية`)}\` لكي تتمكن من استخدام الامر مجددا.**`}]}).then(msg => setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now()))
      command.run(client, message, args)
      cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
      setTimeout(() => {
        cooldown.delete(`${command.name}${message.author.id}`)
      }, command.cooldown);
  } else {
    command.run(client, message, args)
  }
}});



  client23.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client23.azkarSlashCommands.get(interaction.commandName);
	    
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

  
  client23.on("ready" , async() => {
    setInterval(() => {
      client23.guilds.cache.forEach(async(guild) => {
        let theAzkarRoom = await azkarDB.get(`azkar_room_${guild.id}`)
        if(!theAzkarRoom) return;
        let theRoom = await guild.channels.cache.find(ch => ch.id == theAzkarRoom)
        let {azkar} = require(`./azkarData/azkar.json`)
        let randomNum = Math.floor(Math.random() * azkar.length)
        let randomZekr = azkar[randomNum]
        let line = azkarDB.get(`azkar_line_${guild.id}`);
        let embed1 = new EmbedBuilder()
        .setTitle(`**عطروا افواهكم بذكر الله**`)
        .setColor(`#0956c6`)
        .setTimestamp()
        .setFooter({text:`الأذكــار`})
        .setThumbnail(`https://i.postimg.cc/g0rDXc6q/2714091.png`)
        .setDescription(`**\`\`\`${randomZekr}\`\`\`**`)
        await theRoom.send({embeds:[embed1]}).catch(async() => {return;})
        if(line){
          await theRoom.send(`${line}`).catch(async() => {return;})
        }
        //-
        let thePrayersRoom = await azkarDB.get(`prayers_room_${guild.id}`)
        if(!thePrayersRoom) return;
        let theRoom2 = await guild.channels.cache.find(ch => ch.id == thePrayersRoom)
        let {prayers} = require(`./azkarData/prayers.json`)
        let randomNum2 = Math.floor(Math.random() * prayers.length)
        let randomPrayer = azkar[randomNum2]
        let embed2 = new EmbedBuilder()
        .setTitle(`**اَلدُّعَاءُ في الإسلام هي عبادة**`)
        .setColor(`#0956c6`)
        .setTimestamp()
        .setFooter({text:`اَلأدُّعَــيــة`})
        .setThumbnail(`https://i.postimg.cc/g0rDXc6q/2714091.png`)
        .setDescription(`**\`\`\`${randomPrayer}\`\`\`**`)
        await theRoom2.send({embeds:[embed2]}).catch(async() => {return;})
        if(line){
          await theRoom2.send(`${line}`).catch(async() => {return;})
        }
        //-
        let theVersesRoom = await azkarDB.get(`verse_${guild.id}`)
        if(!theVersesRoom) return;
        let theRoom3 = await guild.channels.cache.find(ch => ch.id == theVersesRoom)
        let {verses} = require(`./azkarData/verses.json`)
        let randomNum3 = Math.floor(Math.random() * verses.length)
        let randomVerse = verses[randomNum3]
        let embed3 = new EmbedBuilder()
        .setTitle(`**أبتدئ قراءة القرآن باسم الله مستعينا به**`)
        .setColor(`#0956c6`)
        .setTimestamp()
        .setFooter({text:`الأيـــات`})
        .setThumbnail(`https://i.postimg.cc/g0rDXc6q/2714091.png`)
        .setDescription(`**\`\`\`${randomVerse}\`\`\`**`)
        await theRoom3.send({embeds:[embed3]}).catch(async() => {return;})
        if(line){
          await theRoom3.send(`${line}`).catch(async() => {return;})
        }
        //-
        let theInfoRoom = await azkarDB.get(`religious_information_${guild.id}`)
        if(!theInfoRoom) return;
        let theRoom4 = await guild.channels.cache.find(ch => ch.id == theInfoRoom)
        let {information} = require(`./azkarData/information.json`)
        let randomNum4 = Math.floor(Math.random() * information.length)
        let randomInfo = information[randomNum4]
        let embed4 = new EmbedBuilder()
        .setTitle(`**زود ثقافتك بمعرفة دينك**`)
        .setColor(`#0956c6`)
        .setTimestamp()
        .setFooter({text:`الـمـعـلومـات الـديـنـيـة`})
        .setThumbnail(`https://i.postimg.cc/g0rDXc6q/2714091.png`)
        .setDescription(`**\`\`\`${randomInfo}\`\`\`**`)
        await theRoom4.send({embeds:[embed4]}).catch(async() => {return;})
        if(line){
          await theRoom4.send(`${line}`).catch(async() => {return;})
        }

      })
    },  300_000);
  })

  client23.on("interactionCreate" , async(interaction) => {
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
        {name : `\`/set-azkar-room\`` , value : `تحديد روم الاذكار`},
        {name : `\`/set-prayers-room\`` , value : `تحديد روم الأدعية`},
        {name : `\`/set-religious-information-room\`` , value : `تحديد روم المعلومات الدينية`},
        {name : `\`/set-verse-room\`` , value : `تحديد روم الأيات`},
        {name : `\`/set-azkar-line\`` , value : `تحديد خط الأذكار`},
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

   client23.login(token)
   .catch(async(err) => {
    const filtered = azkar.filter(bo => bo != data)
			await tokens.set(`azkar` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})