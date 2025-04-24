const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const systemDB = new Database("/Json-db/Bots/systemDB.json")

let system = tokens.get(`system`)
const path = require('path');
const { readdirSync } = require("fs");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "BuySystem_Modal") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            const Bot_token = interaction.fields.getTextInputValue(`Bot_token`)
            const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`)
            
            const client17 = new Client({intents:131071, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
            
            try{
              const owner = interaction.user.id
                let price1 = prices.get(`system_price_${interaction.guild.id}`) || 100;
                price1 = parseInt(price1)
                
                function generateRandomCode() {
                    const characters = 'AsystemDEFGHIJKLMNOPQRSTUVWXYZasystemdefghijklmnopqrstuvwxyz0123456789';
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
                        name:`**نوع البوت**`,value:`**\`سيستم\`**`,inline:false
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
                    type:`سيستم`,
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
                client17.on('ready' , async() => {
                  const newbalance = parseInt(userbalance) - parseInt(price1)
                  await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
                  const thebut = new ButtonBuilder().setLabel(`دعوة البوت`).setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client17.user.id}&permissions=8&scope=bot%20applications.commands`);const rowss = new ActionRowBuilder().addComponents(thebut);
                 await interaction.user.send({embeds:[doneembeduser] , components:[rowss]})
                })
                let doneembedprove = new EmbedBuilder()
                .setColor('Aqua')
                .setDescription(`**تم شراء بوت \`سيستم\` بواسطة : ${interaction.user}**`)
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
                                                  {name : `نوع البوت` , value : `\`\`\`سيستم\`\`\`` , inline : true},
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
                client17.commands = new Collection();
            client17.events = new Collection();
            require("../../Bots/system/handlers/events")(client17)
            require("../../events/requireBots/system-commands")(client17);
            const folderPath = path.resolve(__dirname, '../../Bots/system/slashcommand17');
            const prefix = Bot_prefix
            client17.systemSlashCommands = new Collection();
  const systemSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("system commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          systemSlashCommands.push(command.data.toJSON());
          client17.systemSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}

const folderPath3 = path.resolve(__dirname, '../../Bots/system/handlers');
for (let file of readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(folderPath3, file))(client17);
}
            client17.on("ready" , async() => {

                try {
                  await rest.put(
                    Routes.applicationCommands(client17.user.id),
                    { body: systemSlashCommands },
                    );
                    
                  } catch (error) {
                    console.error(error)
                  }
          
              });
              const folderPath2 = path.resolve(__dirname, '../../Bots/system/events');

            for (let file of readdirSync(folderPath2).filter(f => f.endsWith('.js'))) {
                const event = require(path.join(folderPath2, file));
            }
                client17.on("interactionCreate" , async(interaction) => {
                    if (interaction.isChatInputCommand()) {
                        if(interaction.user.bot) return;
                      
                      const command = client17.systemSlashCommands.get(interaction.commandName);
                        
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

                  client17.on('ready' , async() => {
                    setInterval(async() => {
                      let systemTokenss = tokens.get(`system`)
                      let thiss = systemTokenss.find(br => br.token == Bot_token)
                      if(thiss) {
                        if(thiss.timeleft <= 0) {
                          console.log(`${client17.user.id} Ended`)
                          await client17.destroy();
                        }
                      }
                    }, 1000);
                  })
                
                  client17.on("interactionCreate" , async(interaction) => {
                    if(interaction.customId === "help_general"){
                      const embed = new EmbedBuilder()
                          .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                          .setTitle('قائمة اوامر البوت')
                          .addFields(
                            {name : `\`/avatar\`` , value : `لرؤية افتارك او فتار شخص اخر`},
                            {name : `\`/server\`` , value : `لرؤية معلومات السيرفر`},
                            {name : `\`/user\`` , value : `لرؤية معلومات حسابك او حساب شخص اخر`},
                            {name : `\`/banner\`` , value : `لرؤية بانرك او بانر شخص اخر`},
                          )
                          .setTimestamp()
                          .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                          .setColor('DarkButNotBlack');
                      const btns = new ActionRowBuilder().addComponents(
                          new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐').setDisabled(true),
                          new ButtonBuilder().setCustomId('help_admin').setLabel('ادمن').setStyle(ButtonStyle.Primary).setEmoji('🛠️'),
                      )
                  
                      await interaction.update({embeds : [embed] , components : [btns]})
                    }else if(interaction.customId === "help_admin"){
                      const embed = new EmbedBuilder()
                      .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                      .setTitle('قائمة اوامر البوت')
                      .addFields(
                        {name : `\`/ban\`` , value : `لاعطاء باند لشخص او ازالته`},
                        {name : `\`/clear\`` , value : `لحذف عدد من الرسائل`},
                        {name : `\`/come\`` , value : `لاستدعاء شخص`},
                        {name : `\`/embed\`` , value : `لقول كلام في ايمبد`},
                        {name : `\`/hide\`` , value : `لاخفاء روم`},
                        {name : `\`/kick\`` , value : `لاعطاء طرد لشخص او ازالته`},
                        {name : `\`/lock\`` , value : `لقفل روم`},
                        {name : `\`/nickname\`` , value : `اعطاء اسم مستعار لشخص او ازالته`},
                        {name : `\`/mute\`` , value : `لاعطاء ميوت لشخص او ازالته`},
                        {name : `\`/role\`` , value : `لاعطاء رتبة لشخص او ازالتها`},
                        {name : `\`/roles\`` , value : `للاستعلام عن رتب السيرفر`},
                        {name : `\`/say\`` , value : `لقول كلام`},
                        {name : `\`/send\`` , value : `لارسال رسالة لشخص ما`},
                        {name : `\`/timeout\`` , value : `لاعطاء تايم اوت لشخص او ازالته`},
                        {name : `\`/unhide\`` , value : `لاظهار روم`},
                        {name : `\`/unlock\`` , value : `لفتح الروم`},
                      )
                      .setTimestamp()
                      .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                      .setColor('DarkButNotBlack');
                  const btns = new ActionRowBuilder().addComponents(
                      new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐'),
                      new ButtonBuilder().setCustomId('help_admin').setLabel('ادمن').setStyle(ButtonStyle.Primary).setEmoji('🛠️').setDisabled(true),
                  )
                  
                  await interaction.update({embeds : [embed] , components : [btns]})
                    }
                  })

                  await client17.login(Bot_token).catch(async() => {
                    return interaction.editReply({content:`**فشل التحقق , الرجاء تفعيل اخر ثلاث خيارات في قائمة البوت**`})
                  })
                  if(!system) {
                      await tokens.set(`system` , [{token:Bot_token,prefix:Bot_prefix,clientId:client17.user.id,owner:interaction.user.id,timeleft:2629744}])
                  }else {
                      await tokens.push(`system` , {token:Bot_token,prefix:Bot_prefix,clientId:client17.user.id,owner:interaction.user.id,timeleft:2629744})
                  }
        
            
            }catch(error){
                console.error(error)
                return interaction.editReply({content:`**قم بتفعيل الخيارات الثلاثة او التاكد من توكن البوت ثم اعد المحاولة**`})
            }
        }
    }
  }
}