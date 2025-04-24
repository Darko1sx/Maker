
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const creditDB = new Database("/Json-db/Bots/creditDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

const Captchas = [
	{
	 captcha:`https://tvforyou.sirv.com/Images/46147.webp`,
	 number:46147
	},
	{
	 captcha:`https://tvforyou.sirv.com/Images/12654.png`,
	 number:12654
	},
	{
	 captcha:`https://tvforyou.sirv.com/Images/94169.png`,
	 number:94169
	},
	{
	 captcha:`https://tvforyou.sirv.com/Images/35529.png`,
	 number:35529
	},
	{
	 captcha:`https://tvforyou.sirv.com/Images/56412.png`,
	 number:56412
	},
	{
	 captcha:`https://tvforyou.sirv.com/Images/92641.png`,
	 number:92641
	},
	{
	 captcha:`https://tvforyou.sirv.com/Images/10682.png`,
	 number:10682
	},
	 {
	   captcha:`https://tvforyou.sirv.com/Images/82345.png`,
	   number:82345
	 },
	 {
	  captcha:`https://tvforyou.sirv.com/Images/92132.png`,
	  number:92132 
	 },
	 {
	  captcha:`https://tvforyou.sirv.com/Images/61826.png`,
	  number:61826 
	 }
   ]
function getCaptcha() {
  const randomCaptcha = Math.floor(Math.random() * Captchas.length);
  const randomCaptcha2 = Captchas[randomCaptcha];
  const captcha = randomCaptcha2.captcha;
  const number = randomCaptcha2.number;
  return { captcha, number};
}
let credit = tokens.get('credit')
if(!credit) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
credit.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client16 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client16.commands = new Collection();
  client16.setMaxListeners(1000)

  require(`./handlers/events`)(client16);
  client16.events = new Collection();
  require(`../../events/requireBots/credit-commands`)(client16);
  const rest = new REST({ version: '10' }).setToken(token);
  client16.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client16.user.id),
          { body: creditSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client16.once('ready', () => {
    client16.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`credit bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client16.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`credit`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client16.users.cache.get(owner) || await client16.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : كريدت وهمي\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`credit`, filtered);
          await client16.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`./handlers/events`)(client16)

  const folderPath = path.join(__dirname, 'slashcommand16');
  client16.creditSlashCommands = new Collection();
  const creditSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("credit commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          creditSlashCommands.push(command.data.toJSON());
          client16.creditSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand16');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/credit-commands`)(client16)
require("./handlers/events")(client16)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client16.once(event.name, (...args) => event.execute(...args));
	} else {
		client16.on(event.name, (...args) => event.execute(...args));
	}
	}




  client16.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client16.creditSlashCommands.get(interaction.commandName);
	    
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

  client16.on("messageCreate" , async(message) => {
    if(message.author.bot) return;
    if(message.content.toLocaleLowerCase().startsWith(`${prefix}credit`) || message.content.toLocaleLowerCase().startsWith(`${prefix}credits`) || message.content.toLocaleLowerCase().startsWith(`c`)) {
      let authorCredits = creditDB.get(`credits_${message.author.id}_${message.guild.id}`)
      if(!authorCredits) {
          await creditDB.set(`credits_${message.author.id}_${message.guild.id}` , 0)
      }
      authorCredits = creditDB.get(`credits_${message.author.id}_${message.guild.id}`)
      let userId = message.content.split(" ")[1]
      if(!userId) {
        return message.reply({content:`**:bank: |  ${message.author.username}, your account balance is \`$${authorCredits}\`.**`  , allowedMentions : {repliedUser : false}})
      }
      let user = await message.mentions.members.first() ?? await client16.users.fetch(userId)
      if(user.id == message.author.id) {
        return message.reply({content:`**:bank: |  ${message.author.username}, your account balance is \`$${authorCredits}\`.**`  , allowedMentions : {repliedUser : false}})
      }
      if(user.bot ?? user.user.bot)return message.reply({content : `:thinking:  | **${message.author.username}**, bots do not have credits!` , allowedMentions : {repliedUser : false}})
      let amount = message.content.split(" ")[2]
      if(!amount) {
        let user2Credits = creditDB.get(`credits_${user.id ?? user.user.id}_${message.guild.id}`)
      if(!user2Credits) {
          await creditDB.set(`credits_${user.id ?? user.user.id}_${message.guild.id}` , 0)
      }
      user2Credits = creditDB.get(`credits_${user.id ?? user.user.id}_${message.guild.id}`)
        return message.reply({content:`**${user.username ?? user.user.username} :credit_card: balance is \`$${user2Credits}\`.**`  , allowedMentions : {repliedUser : false}})
      }
      let user2Credits = creditDB.get(`credits_${user.id ?? user.user.id}_${message.guild.id}`)
      if(!user2Credits) {
          await creditDB.set(`credits_${user.id ?? user.user.id}_${message.guild.id}` , 0)
      }
      user2Credits = creditDB.get(`credits_${user.id ?? user.user.id}_${message.guild.id}`)
      if(amount > authorCredits) return message.reply({content:`**:thinking: | ${message.author.username}, Your balance is not enough for that!**`  , allowedMentions : {repliedUser : false}})
      if(amount <= 0) return message.reply({content:`** :interrobang: | ${message.author.username}, type the credit you need to transfer!**`  , allowedMentions : {repliedUser : false}})
      let theTax = Math.floor(parseInt(amount) * (5 / 100))
    if(amount == 1) theTax = 0
    if(theTax < 1 && amount < 1) theTax = 1
      const theFinal = parseInt(amount) - parseInt(theTax)
      const theFinalNum = theFinal
      const randomCaptcha = getCaptcha();
      let {captcha , number} = randomCaptcha;
      let messageReply = await message.reply({content:`** ${message.author.username}, Transfer Fees: \`${theTax}\`, Amount :\`$${theFinalNum}\`**\ntype these numbers to confirm :` , files:[{name:`captcha.png` , attachment:`${captcha}`}]  , allowedMentions : {repliedUser : false}})
     setTimeout(() => {
      try {
        messageReply.delete().catch(async() => {return;});
      } catch  {
        return;
      }
     }, 15 * 1000);
      const filter = ((m => m.author.id == message.author.id))
      const messageCollect = message.channel.createMessageCollector({
        filter:filter,
        time:15 * 1000,
        max:1,
        reason : ['time']
      })
      messageCollect.on("collect" , async(msg) => {
        try {
        if(msg.content == number) {
          let newUser1 = parseInt(authorCredits) - parseInt(amount)
          let newUser2 = parseInt(user2Credits) + parseInt(theFinalNum)
          await creditDB.set(`credits_${user.id ?? user.user.id}_${message.guild.id}` , newUser2)
          await creditDB.set(`credits_${message.author.id}_${message.guild.id}` , newUser1)
          await msg.reply({content:`**:moneybag: | ${message.author.username}, has transferred \`$${theFinalNum}\` to ${user}**` , allowedMentions : {repliedUser : false}})
          await user.send(`:atm: | Transfer Receipt \`\`\`You have received $${theFinalNum} from user ${message.author.username} (ID: ${message.author.id})
Reason: No reason provided 
\`\`\` `).catch((err) => null);
          await messageReply.delete();
          return msg.delete();  
        }
      } catch {
          return;
        }
      })
      messageCollect.on("end" , async(msg , reason) => {
        if(reason == 'time'){
          await messageReply.delete();
          return msg.delete();
        }
      })
    }
    })




    client16.on("interactionCreate" , async(interaction) => {
      if(interaction.customId === "help_general"){
        const embed = new EmbedBuilder()
            .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
            .setTitle('قائمة اوامر البوت')
            .addFields(
              {name : `\`${prefix}credit\`` , value : `للاستعلام عن رصيدك`},
              {name : `\`${prefix}credit [usermention]\`` , value : `للاستعلام عن رصيد شخص ما`},
              {name : `\`${prefix}credit [usermention] [number]\`` , value : `لتحويل كريدت لشخص ما`},
            )
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
          {name : `\`/add-credit\`` , value : `لاضافة كريدت الى شخص`},
          {name : `\`/remove-credit\`` , value : `لازالة كريدت من شخص`},
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
   client16.login(token)
   .catch(async(err) => {
    const filtered = credit.filter(bo => bo != data)
			await tokens.set(`credit` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
