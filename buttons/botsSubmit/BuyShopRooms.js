const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const shopRoomsDB = new Database("/Json-db/Bots/shopRoomsDB.json")
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');

let shopRooms = tokens.get(`shopRooms`)
const path = require('path');
const { readdirSync } = require("fs");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "BuyShopRooms_Modal") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            const Bot_token = interaction.fields.getTextInputValue(`Bot_token`)
            const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`)
            
            const client24 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
            
            try{
              const owner = interaction.user.id
                let price1 = prices.get(`shopRooms_price_${interaction.guild.id}`) || 40;
                price1 = parseInt(price1)
                
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
                        name:`**نوع البوت**`,value:`**\`رومات شوب\`**`,inline:false
                    },
                    {
                        name:`**توكن البوت**`,value:`**\`${Bot_token}\`**`,inline:false
                    },
                    {
                        name:`**البريفكس**`,value:`**\`${Bot_prefix}\`**`,inline:false
                    }
                )
                await invoices.set(`${invoice}_${interaction.guild.id}` , 
                {
                    type:`رومات شوب`,
                    token:`${Bot_token}`,
                    prefix:`${Bot_prefix}`,
                    userid:`${interaction.user.id}`,
                    guildid:`${interaction.guild.id}`,
                    serverid:`عام`,
                    price:price1
                })
                const { REST } = require('@discordjs/rest');
                const rest = new REST({ version: '10' }).setToken(Bot_token);
                const { Routes } = require('discord-api-types/v10');
                client24.on('ready' , async() => {
                  const newbalance = parseInt(userbalance) - parseInt(price1)
                  await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
                  const thebut = new ButtonBuilder().setLabel(`دعوة البوت`).setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client24.user.id}&permissions=8&scope=bot%20applications.commands`);const rowss = new ActionRowBuilder().addComponents(thebut);
                 await interaction.user.send({embeds:[doneembeduser] , components:[rowss]})
                })
                let doneembedprove = new EmbedBuilder()
                .setColor('Aqua')
                .setDescription(`**تم شراء بوت \`رومات شوب\` بواسطة : ${interaction.user}**`)
                .setTimestamp()
                let logroom =  setting.get(`log_room_${interaction.guild.id}`)
                let theroom = interaction.guild.channels.cache.find(ch => ch.id == logroom)
               await theroom.send({embeds:[doneembedprove]})
                  // انشاء ايمبد لوج لعملية الشراء و جلب معلومات روم اللوج في السيرفر الرسمي و ارسال الايمبد هناك
                  const { WebhookClient } = require('discord.js')
                  const { purchaseWebhookUrl } = require('../../config.json');
                  const webhookClient = new WebhookClient({ url : purchaseWebhookUrl });
                  const theEmbed = new EmbedBuilder()
                                              .setColor('Green')
                                              .setTitle('تمت عملية شراء جديدة')
                                              .addFields(
                                                  {name : `نوع البوت` , value : `\`\`\`رومات شوب\`\`\`` , inline : true},
                                                  {name : `سعر البوت` , value : `\`\`\`${price1}\`\`\`` , inline : true},
                                                  {name : `المشتري` , value : `\`\`\`${interaction.user.username} , [${interaction.user.id}]\`\`\`` , inline : true},
                                                  {name : `السيرفر` , value : `\`\`\`${interaction.guild.name} [${interaction.guild.id}]\`\`\`` , inline : true},
                                                  {name : `صاحب السيرفر` , value : `\`\`\`${interaction.guild.ownerId}\`\`\`` , inline : true},
                                                  {name : `الفاتورة` , value : `\`\`\`${invoice}\`\`\`` , inline : false},
                                              )
                  await webhookClient.send({embeds : [theEmbed]})

               let userbots = usersdata.get(`bots_${interaction.user.id}_${interaction.guild.id}`);
               if(!userbots) {
                await usersdata.set(`bots_${interaction.user.id}_${interaction.guild.id}` , 1)
               }else {
                userbots = userbots + 1
                await usersdata.set(`bots_${interaction.user.id}_${interaction.guild.id}` , userbots) 
               }
                await interaction.editReply({content:`**تم انشاء بوتك بنجاح وتم خصم \`${price1}\` من رصيدك**`})
                client24.commands = new Collection();
            client24.events = new Collection();
            require("../../Bots/shopRooms/handlers/events")(client24)
            require("../../events/requireBots/shopRooms-commands")(client24);
            const folderPath = path.resolve(__dirname, '../../Bots/shopRooms/slashcommand24');
            const prefix = Bot_prefix
            client24.shopRoomsSlashCommands = new Collection();
  const shopRoomsSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("shopRooms commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          shopRoomsSlashCommands.push(command.data.toJSON());
          client24.shopRoomsSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}
const folderPath3 = path.resolve(__dirname, '../../Bots/shopRooms/handlers');
for (let file of readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(folderPath3, file))(client24);
}



client24.on('ready' , async() => {
  setInterval(async() => {
    let BroadcastTokenss = tokens.get(`shopRooms`)
    let thiss = BroadcastTokenss.find(br => br.token == Bot_token)
    if(thiss) {
      if(thiss.timeleft <= 0) {
          console.log(`${client24.user.id} Ended`)
        await client24.destroy();
      }
    }
  }, 1000);
})

client24.on("ready" , async() => {
  setInterval(async() => {
       let guild = client24.guilds.cache.first()
       if(!guild) return;
    let openhour = await shopRoomsDB.get(`openhour_${guild.id}` )
    let openminute = await shopRoomsDB.get(`openminute_${guild.id}` )
    let closehour = await shopRoomsDB.get(`closehour_${guild.id}` )
   let closeminute =  await shopRoomsDB.get(`closeminute_${guild.id}` )
    let logroom = await shopRoomsDB.get(`logroom_${guild.id}` )
    let category = await shopRoomsDB.get(`category_${guild.id}` )
     if(!openhour || !openminute || !closehour || !closeminute || !logroom || !category) return;
     if(!shopRoomsDB.has(`rooms_${guild.id}`)) {
         await shopRoomsDB.set(`rooms_${guild.id}` , [])
     }
     let rooms = await shopRoomsDB.get(`rooms_${guild.id}`)
     if(!rooms || rooms.length <= 0) return;
     const now = moment();
     const hour = now.hour();
     const minute = now.minute();
     let second = now.second();
     if (hour == openhour && minute == openminute && second == 0) {
      rooms.forEach(async(room) => {
        let theChannel =  await guild.channels.create({
             name:`${room.roomname}`,
             parent:`${category}`,
             permissionOverwrites:[
                 {
                     id: guild.id,
                     deny: [
                         PermissionsBitField.Flags.AttachFiles,
                         PermissionsBitField.Flags.EmbedLinks,
                         PermissionsBitField.Flags.SendMessages,
                         PermissionsBitField.Flags.MentionEveryone
                     ],
                 },
                 ...room.permissionRoles.map((roleId) => ({ id: roleId, allow: [PermissionsBitField.Flags.AttachFiles,
                     PermissionsBitField.Flags.EmbedLinks,
                     PermissionsBitField.Flags.SendMessages,
                     PermissionsBitField.Flags.MentionEveryone] })),
             ]})
             
         })
         let theLogRoom = await guild.channels.cache.find(ch => ch.id == logroom)
         let today = new Date().toLocaleString();
         let embed1 = new EmbedBuilder()
         .setDescription(`**تم فتح الرومات بنجاح بتاريخ\`\`\`${today}\`\`\`**`)
         .setTimestamp()

         await theLogRoom.send({embeds:[embed1]})
     }
     if(hour == closehour && minute == closeminute && second == 0) {
      rooms.forEach(async(room) => {
      
        let theChannel = await guild.channels.cache.find(ch => ch.name == room.roomname)
        try{
            theChannel.delete()
        }catch{
            setTimeout(() => {
                theChannel.delete()
            }, 1000);
        }
            
        })
        let theLogRoom = await guild.channels.cache.find(ch => ch.id == logroom)
        let today = new Date().toLocaleString();
         let embed1 = new EmbedBuilder()
         .setDescription(`**تم غلق الرومات بنجاح بتاريخ\`\`\`${today}\`\`\`**`)
         .setTimestamp()

         await theLogRoom.send({embeds:[embed1]})
     }

  }, 1000);
})


client24.on("interactionCreate" , async(interaction) => {
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
      {name : `\`/setup\`` , value : `لتسطيب نظام رومات الشوب`},
      {name : `\`/add-room\`` , value : `اضافة روم الى نظام رومات الشوب`},
      {name : `\`/remove-room\`` , value : `ازالة روم من نظام رومات الشوب`},
      {name : `\`/create-rooms\`` , value : `لانشاء رومات الشوب يدويا`},
      {name : `\`/delete-rooms\`` , value : `لحذف رومات الشوب يدويا`},
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

            client24.on("ready" , async() => {

                try {
                  await rest.put(
                    Routes.applicationCommands(client24.user.id),
                    { body: shopRoomsSlashCommands },
                    );
                    
                  } catch (error) {
                    console.error(error)
                  }
          
              });
              const folderPath2 = path.resolve(__dirname, '../../Bots/shopRooms/events');

            for (let file of readdirSync(folderPath2).filter(f => f.endsWith('.js'))) {
                const event = require(path.join(folderPath2, file));
            }
                client24.on("interactionCreate" , async(interaction) => {
                    if (interaction.isChatInputCommand()) {
                        if(interaction.user.bot) return;
                      
                      const command = client24.shopRoomsSlashCommands.get(interaction.commandName);
                        
                      if (!command) {
                        console.error(`No command matching ${interaction.commandName} was found.`);
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
                            console.error(`Error executing ${interaction.commandName}`);
                            console.error(error);
                        }
                    }
                  } )

                  
                  
                  client24.on("messageCreate" , async(message) => {
                    let client = message.client;
                  if (message.author.bot) return;
                  if (message.channel.type === 'dm') return;
                
                
                  if(!message.content.startsWith(prefix)) return;
                  const args = message.content.slice(prefix.length).trim().split(/ +/g); 
                  const cmd = args.shift().toLowerCase();
                  if(cmd.length == 0 ) return;
                  let command = client.commands.get(cmd)
                  if(!command) command = client24.commands.get(client.commandaliases.get(cmd));
                
                  if(command) {
                    if(command.ownersOnly) {
                            if (owner != message.author.id) {
                              return message.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
                            }
                    }
                    if(command.cooldown) {
                        
                      if(cooldown.has(`${command.name}${message.author.id}`)) return message.reply({ embeds:[{description:`**عليك الانتظار\`${ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true}).replace("minutes", `دقيقة`).replace("seconds", `ثانية`).replace("second", `ثانية`).replace("ms", `ملي ثانية`)}\` لكي تتمكن من استخدام الامر مجددا.**`}]}).then(msg => setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now()))
                      command.run(client, message, args)
                      cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
                      setTimeout(() => {
                        cooldown.delete(`${command.name}${message.author.id}`)
                      }, command.cooldown);
                  } else {
                    command.run(client, message, args)
                  }}});
                  await client24.login(Bot_token).catch(async() => {
                    return interaction.editReply({content:`**فشل التحقق , الرجاء تفعيل اخر ثلاث خيارات في قائمة البوت**`})
                  })
                  if(!shopRooms) {
                      await tokens.set(`shopRooms` , [{token:Bot_token,prefix:Bot_prefix,clientId:client24.user.id,owner:interaction.user.id,timeleft:2629744}])
                  }else {
                      await tokens.push(`shopRooms` , {token:Bot_token,prefix:Bot_prefix,clientId:client24.user.id,owner:interaction.user.id,timeleft:2629744})
                  }
        
            
            }catch(error){
                console.error(error)
                return interaction.editReply({content:`**قم بتفعيل الخيارات الثلاثة او التاكد من توكن البوت ثم اعد المحاولة**`})
            }
        }
    }
  }
}