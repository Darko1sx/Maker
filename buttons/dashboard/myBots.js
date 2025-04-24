const { Client, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, Interaction, SlashCommandBuilder, Collection, Events, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, MessageComponentCollector, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Database } = require("st.db");
const tokens = new Database("/tokens/tokens");
const makerDashboardDB = new Database("/Json-db/Others/makerDashboard")
const usersdata = new Database(`/database/usersdata/usersdata`)
const setting = new Database("/database/settingsdata/setting")
const isImage = require('is-image-header');
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const { mainguild } = require('../../config.json')

module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
   */
  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === 'MyBots') {
        try {
          await interaction.deferReply({ ephemeral: true });
    
          // Array of all the keys you want to check
          const keys = [
            "azkar", "shopRooms", "scam", "Bc", "tax", "logs", "ticket", "blacklist",
            "probot", "autoline", "feedback", "suggestions", "giveaway", "apply",
            "nadeko", "credit", "Broadcast2", "protect", "system", "shop", "orders",
            "privateRooms", "roles", "quran", "one4all"
          ];
    
          // Collect all owned bots from all arrays
          let ownedBots = [];
    
          keys.forEach(key => {
            const bots = getTheArrays(interaction, tokens, key);
            ownedBots = ownedBots.concat(bots);
          });
    
          if (ownedBots.length <= 0) {
            return await interaction.editReply({ content: `**عذرًا، يبدو أنك لا تملك أي بوتات في الوقت الحالي.**` });
          } else {
            const rows = [];
            let select = new StringSelectMenuBuilder()
              .setCustomId('mybots_select_0')
              .setPlaceholder('اختر بوتك من القائمة التالية');
    
            let count = 0;
            let selectIndex = 0;
    
            for (const bot of ownedBots) {
              const { token, prefix, clientId, owner, timeleft, type } = bot;
              const client2 = new Client({ intents: 131071 });
    
              try {
                await client2.login(token);
    
                select.addOptions(
                  new StringSelectMenuOptionBuilder()
                    .setLabel(`${client2.user.username}`)
                    .setDescription(`النوع : ${type}`)
                    .setValue(`${type}-${clientId}`)
                );
    
                count++;
    
                if (count === 25) {
                  rows.push(new ActionRowBuilder().addComponents(select));
                  selectIndex++;
                  select = new StringSelectMenuBuilder()
                    .setCustomId(`mybots_select_${selectIndex}`)
                    .setPlaceholder('اختر بوتك من القائمة التالية');
                  count = 0;
                }
    
              } catch (error) {
                console.log(`🔴 | Failed to login with token for bot ${clientId}`, error);
              }
            }
    
            if (count > 0) {
              rows.push(new ActionRowBuilder().addComponents(select));
            }
    
            const embed = new EmbedBuilder()
              .setDescription(`> **📋 اختر البوت من القائمة أدناه لعرض معلوماته**`)
              .setColor('DarkBlue')
              .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
              .setFooter({ text: `تمتلك ${ownedBots.length} بوت`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
    
            await interaction.editReply({ embeds: [embed], components: rows });
          }
        } catch (error) {
          console.log("🔴 | Error in the MyBots event", error);
          await interaction.editReply({ content: `**لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**` });
        }
      }
    }
    
    if(interaction.isStringSelectMenu()){
      if(interaction.customId.startsWith("mybots_select")){
        const selectd = interaction.values[0] || interaction.values[1] || interaction.values[2] || interaction.values[3] || interaction.values[4]  || interaction.values[5];
        const [type, clientId] = selectd.split('-');

        const data = await tokens.get(type);
        if(!data) return interaction.message.edit({content : `` , embeds : [new EmbedBuilder().setDescription(`> **عذرا لم اعثر على معلومات البوت**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })]})
        
        const theData = data.find((d) => d.clientId === clientId);
        if(!theData) return interaction.message.edit({content : `` , embeds : [new EmbedBuilder().setDescription(`> **عذرا لم اعثر على معلومات البوت**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })]})

        const remainingTime = theData.timeleft * 1000 + Date.now(); // Convert remaining seconds to milliseconds and add to current timestamp
        const client2 = new Client({intents : 131071})
        await client2.login(theData.token).then(async() => {
          const embed = new EmbedBuilder()
          .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
          .setColor('DarkBlue')
          .setFooter({text : `Owned By : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
          .addFields(
            {name : `الاسم :` , value : `\`${client2.user ? client2.user.username : "غير محدد"}\`` , inline : true},
            {name : `الايدي :` , value : `\`${clientId}\`` , inline : true},
            {name : `النوع :` , value : `\`${type}\`` , inline : true},
            {name : `التوكن :` , value : `\`\`\`${theData ? theData.token : "غير محدد"}\`\`\`` , inline : true},
            {name : `البريفكس :` , value : `\`${theData ? theData.prefix : "غير محدد"}\`` , inline : false},
            {name : `ينتهي في :` , value : `<t:${Math.floor(remainingTime / 1000)}:R>` , inline : false},
          );
const btns = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`RenewBotModalShow`).setStyle(ButtonStyle.Danger).setEmoji('🔄').setLabel('Renew Bot'),
            new ButtonBuilder().setCustomId(`showServers`).setStyle(ButtonStyle.Success).setEmoji('👀').setLabel('Show Servers'),
            new ButtonBuilder().setCustomId(`changeUsernameModalShow`).setStyle(ButtonStyle.Primary).setEmoji('📝').setLabel('Change Username'),
            new ButtonBuilder().setCustomId(`changeAvatarModalShow`).setStyle(ButtonStyle.Primary).setEmoji('📝').setLabel('Change Avatar'),
)

          await makerDashboardDB.set(`mybots_${interaction.message.id}` , {...theData , "type" : type})
          await interaction.update({content : `` , embeds : [embed] , components : [btns]})
        }).catch((error) => {return console.log(`🔴 | Failed to login with token for bot ${clientId}`, error);})
                            }
    }

    if(interaction.isButton()){
      if(interaction.customId === "RenewBotModalShow"){
          // تحقق من خطة البوت
           if(interaction.guild.id != mainguild) {
            const subs3 = tier3subscriptions.get(`tier3_subs`) || [];
           const sub3 = subs3.find(su => su.guildid == interaction.guild.id)

           const subs2 = tier2subscriptions.get(`tier2_subs`) || []
           const sub2 = subs2.find(su => su.guildid == interaction.guild.id)
           if(!sub3 || !sub2) {
            const invitebot = new ButtonBuilder().setLabel('السيرفر الرسمي').setURL(`https://discord.gg/tdvubCxu7Y`).setStyle(ButtonStyle.Link);
            const row2 = new ActionRowBuilder().addComponents(invitebot);
            return interaction.update({ephemeral:true,content:`**توجه الى السيرفر الرسمي**` , components:[row2] , embeds : []})
           }
          }else{
            const modal = new ModalBuilder().setCustomId('RenewBotModalSubmit').setTitle('Renew Bot');
                
            const Daysinp = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('DaysValue').setLabel('عدد الايام').setStyle(TextInputStyle.Short));

            await modal.addComponents(Daysinp);
            await interaction.showModal(modal)
          }
      }
    }

    if(interaction.isModalSubmit()){
      if(interaction.customId === "RenewBotModalSubmit"){
        const DaysValue = interaction.fields.getTextInputValue(`DaysValue`);
        if(isNaN(DaysValue) || DaysValue <= 0 || DaysValue % 1 != 0) return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **عذرا يرجى تحديد عدد ايام صحيح**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })]})
        
        const data = await makerDashboardDB.get(`mybots_${interaction.message.id}`);
        if(!data) return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **عذرا لم اعثر على معلومات البوت**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })]})
        
          // 40k buy - 30k renew
          const typesZero = ['apply' , 'autoline' , 'azkar' , 'blacklist' , 'credit' , 'feedback' , 'giveaway' , 'logs' , 'nadeko' , 'orders' , 'probot' , 'protect' , 'quran' , 'scam' , 'shopRooms' , 'suggestions' , 'tax' , 'Broadcast2']
          // 70k buy - 60k renew
          const typesOne = ['roles' , 'shop' , 'privateRooms'];
          // 100k buy - 90k renew
          const typesTwo = ['Bc' , 'system'];
          // 130k buy - 120k renew
          const typesThree = [];
          // 160k buy - 150k renew
          const typesFour = ['ticket']
          // 200k buy - 180k renew
          const typesFive = ['one4all']
          // 230k buy - 210k renew
          const typesSix = []
          
          let DayRenewPrice;
          if(typesZero.includes(data.type)){
            DayRenewPrice = 1;
          }else if(typesOne.includes(data.type)){
            DayRenewPrice = 2;
          }else if(typesTwo.includes(data.type)){
            DayRenewPrice = 3;
          }else if(typesThree.includes(data.type)){
            DayRenewPrice = 4;
          }else if(typesFour.includes(data.type)){
            DayRenewPrice = 5;
          }else if(typesFive.includes(data.type)){
            DayRenewPrice = 6;
          }else if(typesSix.includes(data.type)){
            DayRenewPrice = 7;
          }else{
            return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })]})
          }

          const totalRenewPrice = Math.floor(DaysValue * DayRenewPrice)

        let userbalance = usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`) ?? 0;

        if(userbalance >= totalRenewPrice){
          const tokensData = tokens.get(data.type);
          if(!tokensData) return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })]})
          const theTokenData = tokensData.find(su => su.clientId == data.clientId)
          if(!theTokenData) return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })]})

            const daysByHours = Math.floor(parseInt(DaysValue) * 24)
            const daysByMins = Math.floor(parseInt(daysByHours) * 60)
            const daysBySecs = Math.floor(parseInt(daysByMins) * 60)
            let {timeleft} = theTokenData;
            timeleft = timeleft + daysBySecs
            theTokenData.timeleft = timeleft
            await tokens.set(`${data.type}` , tokensData)
  
          const newbalance = parseInt(userbalance) - parseInt(totalRenewPrice)
          await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
          
          // ارسال رسالة في روم اللوج
          let doneembedprove = new EmbedBuilder()
                                      .setColor('Green')
                                      .setDescription(`**تم تجديد اشتراك بوت \`${data.type}\` بقيمة \`${totalRenewPrice}\` كوين بواسطة : <@${interaction.user.id}>**`)
                                      .setTimestamp()
          let logroom =  await setting.get(`log_room_${interaction.guild.id}`)
          if(logroom){
              let theroom = await interaction.guild.channels.cache.find(ch => ch.id == logroom)
              if(theroom){
                  await theroom.send({embeds:[doneembedprove]}).catch((err) => {console.log('error : ' , err)})
              }
          }
          return interaction.update({content : `**✅ تم تجديد اشتراك البوت بنجاح لمدة ${DaysValue} يومًا. نشكرك على التعامل معنا!**` , components : [] , embeds : []})
        }else{
          return interaction.update({content : `**عذرا لا تمتلك رصيد كافي ـ سعر التجديد \`${totalRenewPrice}\` عمله 🪙**` , components : [] , embeds : []})
        }
      }
    }

    if(interaction.isButton()){
      if(interaction.customId === "showServers"){
         const data = await makerDashboardDB.get(`mybots_${interaction.message.id}`);
         if(!data) return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **عذرا لم اعثر على معلومات البوت**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []});

         const client2 = new Client({intents : 131071})
         client2.login(data.token).then(async() => {
              const embed = new EmbedBuilder()
                                  .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                                  .setColor('DarkBlue')
                                  .setFooter({text : `Owned By : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})});
              if(client2.guilds.cache.size > 0){
                await client2.guilds.cache.forEach(async(guild) => {
                  const theGuild = await client2.guilds.fetch(guild.id)
                  embed.addFields({
                    name : `🔷 - ${theGuild ? theGuild.name : "غير معرف"} (\`${theGuild ? theGuild.id : "غير معرف"}\`)` , value : `\n`
                  })
                })
                const btns = new ActionRowBuilder().addComponents(
                  new ButtonBuilder().setCustomId('leaveServerModalShow').setLabel('Leave server').setStyle(ButtonStyle.Primary).setEmoji('📤'),
                  new ButtonBuilder().setCustomId('disdis').setLabel(`${client2.guilds.cache.size} server(s)`).setStyle(ButtonStyle.Success).setEmoji('🤖').setDisabled(true),
                  new ButtonBuilder().setCustomId('disdisdis').setLabel(interaction.guild.name).setStyle(ButtonStyle.Secondary).setEmoji('💫').setDisabled(true),
                )
                await interaction.update({content : ``, embeds : [embed] , components : [btns]})
              }else{
                await embed.setDescription(`**🚫 البوت ليس موجودًا في أي سيرفر.**`)
                const btns = new ActionRowBuilder().addComponents(
                  new ButtonBuilder().setCustomId('leaveServerModalShow').setLabel('Leave server').setStyle(ButtonStyle.Primary).setEmoji('📤').setDisabled(true),
                  new ButtonBuilder().setCustomId('disdis').setLabel(`${client2.guilds.cache.size} server(s)`).setStyle(ButtonStyle.Success).setEmoji('🤖').setDisabled(true),
                  new ButtonBuilder().setCustomId('disdisdis').setLabel(interaction.guild.name).setStyle(ButtonStyle.Secondary).setEmoji('💫').setDisabled(true),
                )
                await interaction.update({content : ``, embeds : [embed] , components : [btns]})
              }                                  
         }).catch(error => {
          console.log(error);
          return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})
         })
      }else if(interaction.customId === "leaveServerModalShow"){
        const modal = new ModalBuilder().setCustomId('leaveServerModalSubmit').setTitle('Leave Server');
                
        const Serverinp = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('ServerIdValue').setLabel('ايدي السيرفر').setStyle(TextInputStyle.Short));

        await modal.addComponents(Serverinp);
        await interaction.showModal(modal)
      }
    }

    if(interaction.isModalSubmit()){
      if(interaction.customId === "leaveServerModalSubmit"){
        const ServerIdValue = interaction.fields.getTextInputValue(`ServerIdValue`)

        const data = await makerDashboardDB.get(`mybots_${interaction.message.id}`);
        if(!data) return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **عذرا لم اعثر على معلومات البوت**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []});

        const client2 = new Client({intents : 131071})
        await client2.login(data.token).then(async () => {
          const theGuild = client2.guilds.cache.get(ServerIdValue);
          if(!theGuild){
            return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لم اعثر على السيرفر**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})
          }else{
            await theGuild.leave().then(() => {
                  return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **✅ تم الخروج من \`${theGuild.name}\`**`).setColor('Green').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})
            }).catch((error) => {
                  console.log(error);
                  return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})
            })
          }
        }).catch(() => {
          console.log(error);
          return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})
        })
      }
    }

    if(interaction.isButton()){
      if(interaction.customId === "changeUsernameModalShow"){
        const modal = new ModalBuilder().setCustomId('changeUsernameModalSubmit').setTitle('Change Username');
                
        const Nameinp = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('NameValue').setLabel('الاسم الجديد').setStyle(TextInputStyle.Short).setMinLength(2).setMaxLength(30));

        await modal.addComponents(Nameinp);
        await interaction.showModal(modal)
      }
    }

    if(interaction.isModalSubmit()){
      if(interaction.customId === "changeUsernameModalSubmit"){
        const NameValue = interaction.fields.getTextInputValue(`NameValue`);

        const data = await makerDashboardDB.get(`mybots_${interaction.message.id}`);
        if(!data) return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **عذرا لم اعثر على معلومات البوت**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []});

        const client2 = new Client({intents : 131071});
        await client2.login(data.token).then(async() => {
          await client2.user.setUsername(NameValue).then(async() => {
            await interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **✅ تغيير اسم البوت ل \`${NameValue}\`**`).setColor('Green').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []}) 
          }).catch(async(error) => {
            console.log(error);
            return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})
          })
        }).catch((error) => {
          console.log(error);
          return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})
        })
      }
    }

    if(interaction.isButton()){
      if(interaction.customId === "changeAvatarModalShow"){
        const modal = new ModalBuilder().setCustomId('changeAvatarModalSubmit').setTitle('Change Avatar');
                
        const Avatarinp = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('AvatarValue').setLabel('رابط الصورة').setStyle(TextInputStyle.Short));

        await modal.addComponents(Avatarinp);
        await interaction.showModal(modal)
      }
    }

    if(interaction.isModalSubmit()){
      if(interaction.customId === "changeAvatarModalSubmit"){
        const AvatarValue = interaction.fields.getTextInputValue(`AvatarValue`);

        const data = await makerDashboardDB.get(`mybots_${interaction.message.id}`);
        if(!data) return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **عذرا لم اعثر على معلومات البوت**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []});

        const example1 = await isImage(AvatarValue);
        if(example1.success === false) return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **عذرا ، تاكد من رابط الصورة**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})

        const client2 = new Client({intents : 131071});
        await client2.login(data.token).then(async() => {
          await interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **✅ جاري تغيير صورة البوت ، ستتغير بعد دقائق**`).setImage(AvatarValue).setColor('Green').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []}) 
          await client2.user.setAvatar(AvatarValue).then(async() => {
          }).catch(async(error) => {
            console.log(error);
            return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})
          })
        }).catch((error) => {
          console.log(error);
          return interaction.update({content : `` , embeds : [new EmbedBuilder().setDescription(`> **لقد حدث خطأ، يرجى تبليغ المطورين بالمشكلة.**`).setColor('Red').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : []})
        })
      }
    }

  }
};

function getTheArrays(interaction, tokens, name) {
  const allTheArrays = tokens.get(name) || [];
  if (!Array.isArray(allTheArrays)) return [];

  const filteredArray = allTheArrays
    .filter(d => d.owner === interaction.user.id)
    .map(bot => ({ ...bot, type: name }));
  return filteredArray;
}
