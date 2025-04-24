const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
let autoline = tokens.get(`Autoline`) || [];
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const path = require('node:path');
const fs = require('node:fs');
const mongodb = require('mongoose');
const mainBot = require('../../index');
const ms = require("ms")
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "Bot_Maker_Premium_Modal_Subscribe") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            const Bot_token = interaction.fields.getTextInputValue(`Bot_token`)
            const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`)
            const Server_id = interaction.fields.getTextInputValue(`Server_id`)
            const client2 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
           
            try{
                client2.on("ready" , async() => {
                  const invitebot = new ButtonBuilder()
	.setLabel('دعوة البوت')
	.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client2.user.id}&permissions=8&scope=bot`)
	.setStyle(ButtonStyle.Link);
    const row = new ActionRowBuilder().addComponents(invitebot);
                let price1 = prices.get(`bot_maker_premium_price_${interaction.guild.id}`)
                if(!price1) {
                  price1 = 350;
                }
                let makers = tier2subscriptions.get(`tier2_subs`)   
                if(!makers) {
                  await tier2subscriptions.get(`tier2_subs` , []) 
                }             
                makers = tier2subscriptions.get(`tier2_subs`)   
                    
                function generateRandomCode() {
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let code = '';
                    for (let i = 0; i < 12; i++) {
                      if (i > 0 && i % 4 === 0) {
                        code += '-';
                      }
                      const randomIndex = Math.floor(Math.random() * characters.length);
                      code += characters.charAt(randomIndex);
                    }
                    return code;
                  }
                  const invoice = generateRandomCode();
                let doneembeduser = new EmbedBuilder()
                .setTitle(`**تم انشاء بوتك بنجاح**`)
                .setDescription(`**معلومات الفاتورة :**`)
                .addFields(
                    {
                        name:`**الفاتورة**`,value:`**\`${invoice}\`**`,inline:false
                    },
                    {
                        name:`**نوع البوت**`,value:`**\`اشتراك بوت ميكر بريميوم لمدة شهر\`**`,inline:false
                    },
                    {
                        name:`**ايدي السيرفر**`,value:`**\`${Server_id}\`**`,inline:false
                    },
                    {
                      name:`**ملحوظة :**`,value:`**\`\`\`في حالة وضع ايدي سيرفر خطأ يرجى الاتصال بالدعم الفني قبل مرور 15 دقيقة , في حالة مرور الوقت سيجب عليك دفع تكلفة 100 الف كريدت لنقل السيرفر\`\`\`**`,inline:false
                    }
                )
                await invoices.set(`${invoice}_${interaction.guild.id}` , 
                {
                    type:`اشتراك بوت ميكر بريميوم لمدة شهر`,
                    token:Bot_token,
                    prefix:Bot_prefix,
                    userid:`${interaction.user.id}`,
                    guildid:`${interaction.guild.id}`,
                    serverid:`${Server_id}`,
                    price:price1
                })
                const newbalance = parseInt(userbalance) - parseInt(price1)
await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
               await interaction.user.send({embeds:[doneembeduser] , components:[row]})
                let doneembedprove = new EmbedBuilder()
                .setColor('Aqua')
                .setDescription(`**تم شراء \`اشتراك بوت ميكر بريميوم لمدة شهر\` بواسطة : ${interaction.user}**`)
                .setTimestamp();
                let logroom =  setting.get(`log_room_${interaction.guild.id}`)
                let theroom = interaction.guild.channels.cache.find(ch => ch.id == logroom)
               await theroom.send({embeds:[doneembedprove]})
               if(interaction.guild.id == "1170122527150981143"){
                await interaction.member.roles.add("1251870358332641333").catch(() => {return;});
         }
                  // انشاء ايمبد لوج لعملية الشراء و جلب معلومات روم اللوج في السيرفر الرسمي و ارسال الايمبد هناك
                  const { WebhookClient } = require('discord.js')
                  const { purchaseWebhookUrl } = require('../../config.json');
                  const webhookClient = new WebhookClient({ url : purchaseWebhookUrl });
                  const theEmbed = new EmbedBuilder()
                                              .setColor('White')
                                              .setTitle('تمت عملية شراء ميكر جديد')
                                              .addFields(
                                                  {name : `نوع البوت` , value : `\`\`\`ميكر بريميوم\`\`\`` , inline : true},
                                                  {name : `سعر البوت` , value : `\`\`\`${price1}\`\`\`` , inline : true},
                                                  {name : `المشتري` , value : `\`\`\`${interaction.user.username} , [${interaction.user.id}]\`\`\`` , inline : true},
                                                  {name : `السيرفر` , value : `\`\`\`${interaction.guild.name} [${interaction.guild.id}]\`\`\`` , inline : true},
                                                  {name : `صاحب السيرفر` , value : `\`\`\`${interaction.guild.ownerId}\`\`\`` , inline : true},
                                                  {name : `الفاتورة` , value : `\`\`\`${invoice}\`\`\`` , inline : false})
                await webhookClient.send({embeds : [theEmbed]})
                await interaction.editReply({content:`**تم الاشتراك لسيرفرك بنجاح وتم خصم \`${price1}\` من رصيدك**` , components:[row]})
                const obj = {token:Bot_token,owner:interaction.user.id,guildid:Server_id,prefix:Bot_prefix,timeleft:2629744}
                await makers.push(obj)
                makers = makers
                await tier2subscriptions.set('tier2_subs' , makers)
                let usersub = usersdata.get(`sub_${interaction.user.id}`)
                if(!usersub) {
                  await usersdata.set(`sub_${interaction.user.id}` , true)
                }
                })
                client2.commandaliases = new Collection()
    const rest = new REST({ version: '10' }).setToken(Bot_token);
    module.exports = client2;
    client2.on("ready" , async() => {
      const guild = client2.guilds.cache.first();
      setInterval(async() => {
          if(!guild) return;
          const subs2 = tier2subscriptions.get(`tier2_subs`);
          if(!subs2) return;
          const sub = subs2.find(su => su.guildid == guild.id)
          if(!sub) return;
          const theTimeleft = sub.timeleft;
          if(theTimeleft == 0) {
              await client2.users.fetch(owner);
              const theowner = client2.users.cache.find(us => us.id == owner);
              const endEmbed = new EmbedBuilder()
              .setTitle(`**انتهى اشتراك بوت الميكر الخاص بك**`)
              .setDescription(`**انتهى اشتراك بوت الميكر بريميوم الخاص بك يمكنك اعادة الشراء مجددا دون فقد اي من البيانات**`)
              .setTimestamp()
              await theowner.send({embeds:[embed]})
              await client2.destroy();
          }
      }, 1000);
      try {
          await rest.put(
              Routes.applicationCommands(client2.user.id),
              { body: premiumSlashCommands },
          );
      } catch (error) {
          console.error(error);
      }
  })
  client2.premiumSlashCommands = new Collection()
const premiumSlashCommands = [];
const ascii = require('ascii-table');
const { setMaxListeners } = require("events");
const table = new ascii('Owner Commands').setJustify();
try {

const commandsDir = path.join(__dirname, '../../premiumBots/commands'); // Resolve the directory path
if (!fs.existsSync(commandsDir)) {
throw new Error(`'../../premiumBots/commands/' directory does not exist.`);
}
const folders = fs.readdirSync(commandsDir);

for (let folder of folders.filter(folder => !folder.includes('.'))) {
const folderPath = path.join(commandsDir, folder);
const files = fs.readdirSync(folderPath);

for (let file of files.filter(f => f.endsWith('.js'))) {
let command = require(path.join(folderPath, file));

if (command) {
premiumSlashCommands.push(command.data.toJSON());
client2.premiumSlashCommands.set(command.data.name, command);
if (command.data.name) {
table.addRow(`/${command.data.name}`, '🟢 Working');
} else {
table.addRow(`/${command.data.name}`, '🔴 Not Working');
}
}
}
}
} catch (err) {
console.error("An error occurred:", err);
}

try {
const eventsDir = path.join(__dirname, '../../premiumBots/events'); // Resolve the directory path

if (!fs.existsSync(eventsDir)) {
throw new Error(`'../../premiumBots//' directory does not exist.`);
}

const folders = fs.readdirSync(eventsDir);

for (let folder of folders.filter(folder => !folder.includes('.'))) {
const folderPath = path.join(eventsDir, folder);
const files = fs.readdirSync(folderPath);

for (let file of files.filter(f => f.endsWith('.js'))) {
const event = require(path.join(folderPath, file));
if (event.once) {
client2.once(event.name, (...args) => event.execute(...args));
} else {
client2.on(event.name, (...args) => event.execute(...args));
}
}
}
} catch (err) {
console.error("An error occurred:", err);
}

try {
const buttonsDir = path.join(__dirname, '../../buttons'); // Resolve the directory path

if (!fs.existsSync(buttonsDir)) {
throw new Error(`'../../buttons/' directory does not exist.`);
}

const folders = fs.readdirSync(buttonsDir);

for (let folder of folders.filter(folder => !folder.includes('.'))) {
const folderPath = path.join(buttonsDir, folder);
const files = fs.readdirSync(folderPath);

for (let file of files.filter(f => f.endsWith('.js'))) {
const event = require(path.join(folderPath, file));
if (event.once) {
client2.once(event.name, (...args) => event.execute(...args));
} else {
client2.on(event.name, (...args) => event.execute(...args));
}
}
}
} catch (err) {
console.error("An error occurred:", err);
}

client2.on('ready' , async() => {
	const subs2 = tier2subscriptions.get(`tier2_subs`);
	const sub = subs2.find(su => su.guildid == Server_id)
	if(!sub) return;
	try {
		let guilds = client2.guilds.cache.forEach(async(guild) => {
		let subscriptions1 = tier2subscriptions.get(`tier2_subs`)
		if(!subscriptions1) {
			await tier2subscriptions.set(`tier2_subs` , [])
		}
		let filtered = subscriptions1.find(a => a.guildid == guild.id)
		if(!filtered) {
			if(guild.id == Server_id) return;
			await guild.leave();
		}
	})
	} catch (error) {
		return
	}
	
})
client2.on("messageCreate" , async(message) => {
	const subs2 = tier2subscriptions.get(`tier2_subs`);
	const sub = subs2.find(su => su.guildid == Server_id)
	if(!sub) return;
	if(message.content == `<@${client2.user.id}>`) {
		if(message.author.bot) return;
		return message.reply({content:`**Hello In <@${client2.user.id}> , Im Using / Commands**`})
	}
})

//======= -------- =========//
client2.on("guildCreate" , async(guild) => {
	const subs2 = tier2subscriptions.get(`tier2_subs`);
	const sub = subs2.find(su => su.guildid == Server_id)
	if(!sub) return;
	let subscriptions1 = tier2subscriptions.get(`tier2_subs`)
		let filtered = subscriptions1.find(a => a.guildid == guild.id)
		if(!filtered) {
			if(guild.id == Server_id) return;
			await guild.leave();
		}
})
//======= -------- =========//
  //guildCreate
  client2.on("guildCreate", async (guild) => {
    const owner = await client2.users.fetch(guild.ownerId);
    const ownerUsername = owner ? owner.username : "Unknown";
    const { WebhookClient } = require('discord.js')
    const { joinLeaveWebhookUrl } = require('../../config.json');
    const webhookClient = new WebhookClient({ url : joinLeaveWebhookUrl });

    const joinsEmbed = new EmbedBuilder()
      .setTitle("Bot Maker Premium")
      .setColor("Green")
      .setDescription(`Joined: ${guild.name}\nOwner Mention: <@${guild.ownerId}>\nOwner user: ${ownerUsername}\nBot name: ${client2.user.username} \nBot ID: ${client2.user.id}`);

    await webhookClient.send({embeds : [joinsEmbed]});

	const subs2 = tier2subscriptions.get(`tier2_subs`);
	const sub = subs2.find(su => su.guildid == Server_id)
	if(!sub) return;
	let subscriptions1 = tier2subscriptions.get(`tier2_subs`)
		let filtered = subscriptions1.find(a => a.guildid == guild.id)
		if(!filtered) {
			if(guild.id == Server_id) return;
			await guild.leave();
		}
  });

  //GuildDelete
  client2.on("guildDelete", async (guild) => {
    const owner = await client2.users.fetch(guild.ownerId);
    const ownerUsername = owner ? owner.username : "Unknown";
    const { WebhookClient } = require('discord.js')
    const { joinLeaveWebhookUrl } = require('../../config.json');
    const webhookClient = new WebhookClient({ url : joinLeaveWebhookUrl });

    const joinsEmbed = new EmbedBuilder()
                              .setTitle("Bot Maker Premium")
                              .setColor("DarkGreen")
                              .setDescription(`Left: ${guild.name}\nOwner Mention: <@${guild.ownerId}>\nOwner user: ${ownerUsername}\nBot name: ${client2.user.username} \nBot ID: ${client2.user.id}`);

    await webhookClient.send({ embeds: [joinsEmbed] }).catch(() => {return;});
  });

//-------
                 await client2.login(Bot_token).catch(async() => {
              return interaction.editReply({content:`**فشل التحقق , الرجاء تفعيل اخر ثلاث خيارات في قائمة البوت**`})
            })
            }catch(err){
              console.error(err)
                return interaction.editReply({content:`**فشل التحقق**`})
            }
        }
    }
  }
}