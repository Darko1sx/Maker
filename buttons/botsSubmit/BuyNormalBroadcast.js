const { Client, Collection, discord,GatewayIntentBits, Partials ,ModalBuilder,TextInputBuilder,TextInputStyle, EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const Broadcast2DB = new Database("/Json-db/Bots/Broadcast2DB.json")

let normalBroadcast = tokens.get(`Broadcast2`)
const path = require('path');
const { readdirSync } = require("fs");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "BuyNormalBroadcast_Modal") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            const Bot_token = interaction.fields.getTextInputValue(`Bot_token`)
            const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`)
            
            const client18 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildPresences,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
            client18.commands = new Collection();
            
            try{
              const owner = interaction.user.id
                let price1 = prices.get(`normalBroadcast_price_${interaction.guild.id}`) || 40;
                price1 = parseInt(price1)
                
                function generateRandomCode() {
                    const characters = 'ABroadcast2DEFGHIJKLMNOPQRSTUVWXYZaBroadcast2defghijklmnopqrstuvwxyz0123456789';
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
                        name:`**نوع البوت**`,value:`**\`برودكاست عادي\`**`,inline:false
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
                    type:`برودكاست عادي`,
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
                client18.on('ready' , async() => {
                  const newbalance = parseInt(userbalance) - parseInt(price1)
                  await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
                  const thebut = new ButtonBuilder().setLabel(`دعوة البوت`).setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client18.user.id}&permissions=8&scope=bot%20applications.commands`);const rowss = new ActionRowBuilder().addComponents(thebut);
                 await interaction.user.send({embeds:[doneembeduser] , components:[rowss]})
                })
                let doneembedprove = new EmbedBuilder()
                .setColor('Aqua')
                .setDescription(`**تم شراء بوت \`برودكاست عادي\` بواسطة : ${interaction.user}**`)
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
                                                  {name : `نوع البوت` , value : `\`\`\`برودكاست عادي\`\`\`` , inline : true},
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
                client18.commands = new Collection();
            client18.events = new Collection();
            require("../../Bots/NormalBroadcast/handlers/events")(client18)
            require("../../events/requireBots/normal-broadcast-commands")(client18);
            const folderPath = path.resolve(__dirname, '../../Bots/NormalBroadcast/slashcommand18');
            const prefix = Bot_prefix
            client18.Broadcast2SlashCommands = new Collection();
  const Broadcast2SlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("Broadcast2 commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          Broadcast2SlashCommands.push(command.data.toJSON());
          client18.Broadcast2SlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}

const folderPath3 = path.resolve(__dirname, '../../Bots/NormalBroadcast/handlers');
for (let file of readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(folderPath3, file))(client18);
}
            client18.on("ready" , async() => {

                try {
                  await rest.put(
                    Routes.applicationCommands(client18.user.id),
                    { body: Broadcast2SlashCommands },
                    );
                    
                  } catch (error) {
                    console.error(error)
                  }
          
              });
              const folderPath2 = path.resolve(__dirname, '../../Bots/NormalBroadcast/events');

            for (let file of readdirSync(folderPath2).filter(f => f.endsWith('.js'))) {
                const event = require(path.join(folderPath2, file));
            }

            client18.on("messageCreate" , async(message) => {
              if(message.content != `${prefix}bc`) return;
            let guildId = message.guild.id
            let admin_role = await Broadcast2DB.get(`admin_role_${guildId}`);
            if(!admin_role) return;
            if(!message.member.roles.cache.some(role => role.id == admin_role)) return;
          let embed1 = new EmbedBuilder()
          .setFooter({text:message.author.username , iconURL:message.author.displayAvatarURL({dynamic:true})})
            .setAuthor({name:message.guild.name , iconURL:message.guild.iconURL({dynamic:true})})
            .setTimestamp(Date.now())
            .setColor('#000000')
          .setTitle(`**أختر المراد ارساله من القائمة**`)
            let button1 = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel(`أرسال للجميع`)
            .setCustomId(`bc_all`)
            let button2 = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel(`أرسال للمتصلين`)
            .setCustomId(`bc_online`)
            let button3 = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel(`أرسال لغير المتصلين`)
            .setCustomId(`bc_offline`)
            let button4 = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel(`أرسال لرتبة معينة`)
            .setCustomId(`selected_role`)
            let row = new ActionRowBuilder().addComponents(button1,button2,button3,button4)
          return message.reply({embeds:[embed1] , components:[row]})			
          
          })
          
            
          client18.on("interactionCreate" , async(interaction) => {
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
                {name : `\`/select-admin-role\`` , value : `لتحديد رتبة الادمن`},
                {name : `\`/bc\` | \`${prefix}bc\`` , value : `لارسال بانل البرودكاست`},
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
          
          
            client18.on("interactionCreate" , async(interaction) => {
              let guildId = interaction.guild.id
              if (interaction.isChatInputCommand()) {
                
                if(interaction.user.bot) return;
          
                
                const command = client18.Broadcast2SlashCommands.get(interaction.commandName);
                
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
              if (interaction.isButton()) {
                let admin_role = await Broadcast2DB.get(`admin_role_${guildId}`);
                if(!admin_role) return;
                if(!interaction.member.roles.cache.some(role => role.id == admin_role)) return;
                if(interaction.customId == "bc_all") {
                    const modal = new ModalBuilder()
                    .setCustomId('bc_all_members')
                 .setTitle('ارسال رسالة لجميع الاعضاء');
                    const message = new TextInputBuilder()
                    .setCustomId('message')
                    .setLabel("الرسالة")
                      .setStyle(TextInputStyle.Short)
                      .setMaxLength(90)
                    const firstActionRow = new ActionRowBuilder().addComponents(message);
                    modal.addComponents(firstActionRow)
                    await interaction.showModal(modal)
                    await interaction.guild.members.fetch()
                }
                if(interaction.customId == "bc_online") {
                    const modal = new ModalBuilder()
                    .setCustomId('bc_online_members')
                 .setTitle('ارسال رسالة للأعضاء المتصلين');
                    const message = new TextInputBuilder()
                    .setCustomId('message')
                    .setLabel("الرسالة")
                      .setStyle(TextInputStyle.Short)
                      .setMaxLength(90)
                    const firstActionRow = new ActionRowBuilder().addComponents(message);
                    modal.addComponents(firstActionRow)
                    await interaction.showModal(modal)
                    await interaction.guild.members.fetch()
                }
                if(interaction.customId == "bc_offline") {
                    const modal = new ModalBuilder()
                    .setCustomId('bc_offline_members')
                 .setTitle(`ارسال رسالة للأعضاء الغير متصلين`);
                    const message = new TextInputBuilder()
                    .setCustomId('message')
                    .setLabel("الرسالة")
                      .setStyle(TextInputStyle.Short)
                      .setMaxLength(90)
                    const firstActionRow = new ActionRowBuilder().addComponents(message);
                    modal.addComponents(firstActionRow)
                    await interaction.showModal(modal)
                    await interaction.guild.members.fetch()
                }
                if(interaction.customId == "selected_role") {
                    const modal = new ModalBuilder()
                    .setCustomId('bc_selected_role')
                 .setTitle('ارسال رسالة لرتبة معينة');
                    const message = new TextInputBuilder()
                    .setCustomId('message')
                    .setLabel("الرسالة")
                      .setStyle(TextInputStyle.Short)
                      .setMaxLength(90)
                      const roleid = new TextInputBuilder()
                    .setCustomId('roleid')
                    .setLabel("ايدي الرتبة")
                      .setStyle(TextInputStyle.Short)
                      .setMaxLength(90)
                    const firstActionRow = new ActionRowBuilder().addComponents(message);
                    const firstActionRow2 = new ActionRowBuilder().addComponents(roleid);
                    modal.addComponents(firstActionRow)
                    modal.addComponents(firstActionRow2)
                    await interaction.showModal(modal)
                    await interaction.guild.members.fetch()
                }
            }
            if(interaction.isModalSubmit()) {
                let admin_role = await Broadcast2DB.get(`admin_role_${guildId}`);
                if(!admin_role) return;
                if(!interaction.member.roles.cache.some(role => role.id == admin_role)) return;
                // الارسال لجميع الاعضاء الموجودين فالسيرفر
                if (interaction.customId == "bc_all_members") {
                    await interaction.guild.members.fetch();
                    const allMembers = interaction.guild.members.cache.filter(mem => !mem.user.bot).map(memb => memb.user.id);
                    let done = 0;
                    let failed = 0;
                
                    let embed1 = new EmbedBuilder()
                        .setTitle(`**حالة البرودكاست**`)
                        .setDescription(`**⚪ العدد المراد الارسال اليه : ${allMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                        .setTimestamp()
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                
                    let theSend = await interaction.reply({ content : `** ℹ️ - البوت يرسل كل 10 ثواني لشخص وذلك لتقليل نسبة تبنيد البوت **` , embeds: [embed1] });
                
                    for (let i = 0; i < allMembers.length; i++) {
                        const member = allMembers[i];
                        const theMember = interaction.guild.members.cache.find(ro => ro.user.id == member);
                        const message = interaction.fields.getTextInputValue(`message`);
                
                        setTimeout(async () => {
                            try {
                                await theMember.send({ content: `${theMember} - ${message}` });
                                done += 1;
                            } catch (error) {
                                failed += 1;
                            }
                
                            let embed1 = new EmbedBuilder()
                                .setTitle(`**حالة البرودكاست**`)
                                .setDescription(`**⚪ العدد المراد الارسال اليه : ${allMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                                .setTimestamp()
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                            await theSend.edit({ embeds: [embed1] });
                
                            if (done + failed >= allMembers.length) {
                                let embed1 = new EmbedBuilder()
                                    .setTitle(`**تم الانتهاء من الارسال للجميع**`)
                                    .setDescription(`**⚪ العدد المراد الارسال اليه : ${allMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                                    .setTimestamp()
                                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                                await theSend.edit({content : ``, embeds: [embed1] });
                            }
                        }, i * 10000); // 10 seconds delay
                    }
                }
                // الارسال لجميع الاعضاء الاونلاين فالسيرفر
                if (interaction.customId == "bc_online_members") {
                    await interaction.guild.members.fetch();
                    const onlineMembers = [];
                    
                    interaction.guild.members.cache.forEach(member => {
                        if (member.user.bot) return;
                        if (member.presence == null) return;
                        if (member.presence.status != "offline") {
                            onlineMembers.push(member.user.id);
                        }
                    });
                    
                    let done = 0;
                    let failed = 0;
                    
                    let embed1 = new EmbedBuilder()
                        .setTitle(`**حالة البرودكاست**`)
                        .setDescription(`**⚪ العدد المراد الارسال اليه : ${onlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                        .setTimestamp()
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                        
                    let theSend = await interaction.reply({content : `** ℹ️ - البوت يرسل كل 10 ثواني لشخص وذلك لتقليل نسبة تبنيد البوت **` ,  embeds: [embed1] });
                    
                    for (let i = 0; i < onlineMembers.length; i++) {
                        const member = onlineMembers[i];
                        const theMember = interaction.guild.members.cache.find(ro => ro.user.id == member);
                        const message = interaction.fields.getTextInputValue(`message`);
                        
                        setTimeout(async () => {
                            try {
                                await theMember.send({ content: `${theMember} - ${message}` });
                                done += 1;
                            } catch (error) {
                                failed += 1;
                            }
                            
                            let embed1 = new EmbedBuilder()
                                .setTitle(`**حالة البرودكاست**`)
                                .setDescription(`**⚪ العدد المراد الارسال اليه : ${onlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                                .setTimestamp()
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                                
                            await theSend.edit({ embeds: [embed1] });
                            
                            if (done + failed >= onlineMembers.length) {
                                let embed1 = new EmbedBuilder()
                                    .setTitle(`**تم الانتهاء من الارسال للمتصلين**`)
                                    .setDescription(`**⚪ العدد المراد الارسال اليه : ${onlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                                    .setTimestamp()
                                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                                    
                                await theSend.edit({content : ``, embeds: [embed1] });
                            }
                        }, i * 10000); // 10 seconds delay
                    }
                }
                
                if (interaction.customId == "bc_offline_members") {
                    await interaction.guild.members.fetch();
                    const offlineMembers = [];
                    
                    interaction.guild.members.cache.forEach(member => {
                        if (member.user.bot) return;
                        if (member.presence == null) {
                            offlineMembers.push(member.user.id);
                        }
                    });
                    
                    let done = 0;
                    let failed = 0;
                    
                    let embed1 = new EmbedBuilder()
                        .setTitle(`**حالة البرودكاست**`)
                        .setDescription(`**⚪ العدد المراد الارسال اليه : ${offlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                        .setTimestamp()
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                        
                    let theSend = await interaction.reply({content : `** ℹ️ - البوت يرسل كل 10 ثواني لشخص وذلك لتقليل نسبة تبنيد البوت **` ,  embeds: [embed1] });
                    
                    for (let i = 0; i < offlineMembers.length; i++) {
                        const member = offlineMembers[i];
                        const theMember = interaction.guild.members.cache.find(ro => ro.user.id == member);
                        const message = interaction.fields.getTextInputValue(`message`);
                        
                        setTimeout(async () => {
                            try {
                                await theMember.send({ content: `${theMember} - ${message}` });
                                done += 1;
                            } catch (error) {
                                failed += 1;
                            }
                            
                            let embed1 = new EmbedBuilder()
                                .setTitle(`**حالة البرودكاست**`)
                                .setDescription(`**⚪ العدد المراد الارسال اليه : ${offlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                                .setTimestamp()
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                                
                            await theSend.edit({ embeds: [embed1] });
                            
                            if (done + failed >= offlineMembers.length) {
                                let embed1 = new EmbedBuilder()
                                    .setTitle(`**تم الانتهاء من الارسال لغير المتصلين**`)
                                    .setDescription(`**⚪ العدد المراد الارسال اليه : ${offlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                                    .setTimestamp()
                                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                                    
                                await theSend.edit({content : ``, embeds: [embed1] });
                            }
                        }, i * 10000); // 10 seconds delay
                    }
                }
                
                if (interaction.customId == "bc_selected_role") {
                    await interaction.guild.members.fetch();
                    const roleid = interaction.fields.getTextInputValue(`roleid`);
                    const selectedMembers = [];
                    
                    interaction.guild.members.cache.forEach(member => {
                        if (member.user.bot) return;
                        if (member.roles.cache.some(role => role.id == roleid)) {
                            selectedMembers.push(member.user.id);
                        }
                    });
                    
                    let done = 0;
                    let failed = 0;
                    
                    let embed1 = new EmbedBuilder()
                        .setTitle(`**حالة البرودكاست**`)
                        .setDescription(`**⚪ العدد المراد الارسال اليه : ${selectedMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                        .setTimestamp()
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                        
                    let theSend = await interaction.reply({content : `** ℹ️ - البوت يرسل كل 10 ثواني لشخص وذلك لتقليل نسبة تبنيد البوت **` ,  embeds: [embed1] });
                    
                    for (let i = 0; i < selectedMembers.length; i++) {
                        const member = selectedMembers[i];
                        const theMember = interaction.guild.members.cache.find(ro => ro.user.id == member);
                        const message = interaction.fields.getTextInputValue(`message`);
                        
                        setTimeout(async () => {
                            try {
                                await theMember.send({ content: `${theMember} - ${message}` });
                                done += 1;
                            } catch (error) {
                                failed += 1;
                            }
                            
                            let embed1 = new EmbedBuilder()
                                .setTitle(`**حالة البرودكاست**`)
                                .setDescription(`**⚪ العدد المراد الارسال اليه : ${selectedMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                                .setTimestamp()
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                                
                            await theSend.edit({ embeds: [embed1] });
                            
                            if (done + failed >= selectedMembers.length) {
                                let embed1 = new EmbedBuilder()
                                    .setTitle(`**تم الانتهاء من الارسال للرتبة المحددة**`)
                                    .setDescription(`**⚪ العدد المراد الارسال اليه : ${selectedMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                                    .setTimestamp()
                                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                                    
                                await theSend.edit({content : ``, embeds: [embed1] });
                            }
                        }, i * 10000); // 10 seconds delay
                    }
                }
            }
            } )
                  client18.on('ready' , async() => {
                    setInterval(async() => {
                      let normalBroadcastTokenss = tokens.get(`Broadcast2`)
                      let thiss = normalBroadcastTokenss.find(br => br.token == Bot_token)
                      if(thiss) {
                        if(thiss.timeleft <= 0) {
                          console.log(`${client18.user.id} Ended`)
                          await client18.destroy();
                        }
                      }
                    }, 1000);
                  })
                
                  await client18.login(Bot_token).catch(async(err) => {
                    return interaction.editReply({content:`**فشل التحقق , الرجاء تفعيل اخر ثلاث خيارات في قائمة البوت**`})
                  })

                  if(!normalBroadcast) {
                      await tokens.set(`Broadcast2` , [{token:Bot_token,prefix:Bot_prefix,clientId:client18.user.id,owner:interaction.user.id,timeleft:2629744}])
                  }else {
                      await tokens.push(`Broadcast2` , {token:Bot_token,prefix:Bot_prefix,clientId:client18.user.id,owner:interaction.user.id,timeleft:2629744})
                  }
            }catch(error){
                console.error(error)
                return interaction.editReply({content:`**قم بتفعيل الخيارات الثلاثة او التاكد من توكن البوت ثم اعد المحاولة**`})
            }
        }
    }
  }
}