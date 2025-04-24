const { SlashCommandBuilder,Events ,Client, ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js")
const { Database } = require("st.db")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
let autoline = tokens.get(`Autoline`) || [];
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "BuyMaker_Modal") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            const Server_id = interaction.fields.getTextInputValue(`Server_id`)
            const clienter = new Client({intents: 131071})
            
            try{
                const invitebot = new ButtonBuilder()
	.setLabel('دعوة البوت')
	.setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot`)
	.setStyle(ButtonStyle.Link);
    const row = new ActionRowBuilder().addComponents(invitebot);
                let price1 = prices.get(`bot_maker_price_${interaction.guild.id}`)
                if(!price1) {
                  price1 = 150;
                }
                let makers = tier1subscriptions.get(`tier1_subs`)   
                if(!makers) {
                  await tier1subscriptions.get(`tier1_subs` , []) 
                }             
                makers = tier1subscriptions.get(`tier1_subs`)   
                    
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
                        name:`**نوع البوت**`,value:`**\`اشتراك بوت ميكر لمدة شهر\`**`,inline:false
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
                    type:`اشتراك بوت ميكر لمدة شهر`,
                    token:`لم يتم التحديد`,
                    prefix:`لم يتم التحديد`,
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
                .setDescription(`**تم شراء \`اشتراك بوت ميكر لمدة شهر\` بواسطة : ${interaction.user}**`)
                .setTimestamp()
                let logroom =  setting.get(`log_room_${interaction.guild.id}`)
                let theroom = interaction.guild.channels.cache.find(ch => ch.id == logroom)
               await theroom.send({embeds:[doneembedprove]})
               if(interaction.guild.id == "1170122527150981143"){
                await interaction.member.roles.add("1251870542366244885").catch(() => {return;});
                }
                // انشاء ايمبد لوج لعملية الشراء و جلب معلومات روم اللوج في السيرفر الرسمي و ارسال الايمبد هناك
                try {
                  const { WebhookClient } = require('discord.js')
                  const { purchaseWebhookUrl } = require('../../config.json');
                  const webhookClient = new WebhookClient({ url : purchaseWebhookUrl });
                  const theEmbed = new EmbedBuilder()
                                              .setColor('White')
                                              .setTitle('تمت عملية شراء ميكر جديد')
                                              .addFields(
                                                  {name : `نوع البوت` , value : `\`\`\`ميكر برايم\`\`\`` , inline : true},
                                                  {name : `سعر البوت` , value : `\`\`\`${price1}\`\`\`` , inline : true},
                                                  {name : `المشتري` , value : `\`\`\`${interaction.user.username} , [${interaction.user.id}]\`\`\`` , inline : true},
                                                  {name : `السيرفر` , value : `\`\`\`${interaction.guild.name} [${interaction.guild.id}]\`\`\`` , inline : true},
                                                  {name : `صاحب السيرفر` , value : `\`\`\`${interaction.guild.ownerId}\`\`\`` , inline : true},
                                                  {name : `الفاتورة` , value : `\`\`\`${invoice}\`\`\`` , inline : false},
                                              )
                await webhookClient.send({embeds : [theEmbed]})
              } catch (error) {
                  console.log(error.message)
              }
                await interaction.editReply({content:`**تم الاشتراك لسيرفرك بنجاح وتم خصم \`${price1}\` من رصيدك**` , components:[row]})
                const obj = {ownerid:interaction.user.id,guildid:Server_id,timeleft:2629744}
                await makers.push(obj)
                makers = makers
                await tier1subscriptions.set('tier1_subs' , makers)
                let usersub = usersdata.get(`sub_${interaction.user.id}`)
                if(!usersub) {
                  await usersdata.set(`sub_${interaction.user.id}` , true)
                }
            }catch(err){
              console.error(err)
                return interaction.editReply({content:`**فشل التحقق**`})
            }
        }
    }
  }
}