const { Interaction , SlashCommandBuilder,Collection,Events, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting")
const usersdata = new Database(`/database/usersdata/usersdata`)
const mainBot = require('../../index');

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if(interaction.isModalSubmit()) {
        if(interaction.customId == 'BuyBalanceModal') {
          await interaction.deferReply({ephemeral:true})
            let price1 = setting.get(`balance_price_${interaction.guild.id}`) ?? 1000;
            let recipient = setting.get(`recipient_${interaction.guild.id}`)
            let logroom =  setting.get(`log_room_${interaction.guild.id}`)
            let probot = setting.get(`probot_${interaction.guild.id}`)
            let clientrole = setting.get(`client_role_${interaction.guild.id}`)
            if(!price1 || !recipient || !logroom || !probot || !clientrole) return interaction.editReply({content:`**لم يتم تحديد الاعدادات**`})
            let amount = interaction.fields.getTextInputValue(`balance_quantity`)
            if(isNaN(amount)) return interaction.editReply({content:`**الرجاء كتابة رقم صحيح**`})
			if(amount > 1000000000) return interaction.editReply({content:`**الرقم يجب ان لا يزيد عن 1000000000**`})
            let price2 = Math.floor(parseInt(price1 * amount))
            let price3 = Math.floor((price2) * (20/19) + (1))
            let transferembed = new EmbedBuilder()
            .setColor('Aqua')
            .setTitle(`**الرجاء التحويل لاكمال عملية الشراء**`)
            .setDescription(`**\`\`\`#credit ${recipient} ${price3}\`\`\`لديك دقيقة فقط لاكمال عملية التحويل\nالتحويل يكون في روم <#${transferroom}>**`)
            .setTimestamp()
            let transferreply = await interaction.editReply({embeds:[transferembed]})
            let transfersroom = await interaction.guild.channels.cache.find(ch => ch.id == transferroom)
         let transfermessage = transfersroom.send({content:`**${interaction.user} - يمكنك التحويل هنا**`}).then(async(a) => {
          setTimeout(() => {
            a.delete();
          }, 3000);
         })
            const collector = await transfersroom.createMessageCollector({
              filter:collectorFilter,
              max: 1,
              time: 1000 * 60 * 1
          });

         collector.on('collect' , async() => {
          // جلب رصيد المشتري
          let userbalance = usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`)
          // اذا المشتري لم يكن لديه رصيد من قبل اي لديه 0 رصيد
          if(!userbalance) {
            // تعيين رصيد المشتري بالكمية التي اشتراها
            await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , amount)
            // ارسال رسالة لخاص العضو
            let doneembed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`**تم شراء الرصيد بنجاح !**`)
            .setDescription(`**تم شراء رصيد بنجاح رصيدك الحالي هو : \`${amount}\`**`)
            .setTimestamp()
            return transfersroom.send({content:`**${interaction.user}**` , embeds:[doneembed]}).then(async(a) => {setTimeout(() => {
              a.delete().catch(async() => {return;})
            }, 3000);})
          }
          const newbalance = parseInt(userbalance) + parseInt(amount)
          let doneembed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`**تم شراء الرصيد بنجاح !**`)
            .setDescription(`**تم شراء رصيد بنجاح رصيدك الحالي هو : \`${newbalance}\`**`)
            .setTimestamp()
            await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
            await interaction.user.send({embeds:[doneembed]})
            const clientrole = setting.get(`client_role_${interaction.guild.id}`)
            if(clientrole) {
              const therole = interaction.guild.roles.cache.find(ro => ro.id == clientrole)
              if(therole) {
                await interaction.guild.members.cache.get(interaction.user.id).roles.add(therole).catch(async() => {return;})
              }
            }

            await transfersroom.send({content:`**${interaction.user}**` , embeds:[doneembed]}).then(async(a) => {setTimeout(() => {
              a.delete().catch(async() => {return;})
            }, 3000);})

            let doneembedprove = new EmbedBuilder()
                                        .setColor('Aqua')
                                        .setDescription(`**تم شراء \`${amount}\` كوين بواسطة : ${interaction.user}**`)
                                        .setTimestamp();
            let purchaseEmbeds = new EmbedBuilder()
                                        .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                        .setTitle('عملية شراء كوينز جديدة')
                                        .addFields(
                                          {name : `السيرفر` , value : `\`\`\`${interaction.guild.name} (${interaction.guild.id})\`\`\``},
                                          {name : `المشتري` , value : `\`\`\`${interaction.user.username} (${interaction.user.id})\`\`\``},
                                          {name : `عدد الكوينز` , value : `\`\`\`${amount}\`\`\``},
                                          {name : `سعر 1 كوين` , value : `\`\`\`${price1}\`\`\``},
                                          {name : `حساب البنك` , value : `\`\`\`${recipient}\`\`\``},
                                        )

            let logroom =  await setting.get(`log_room_${interaction.guild.id}`)
            let theroom = interaction.guild.channels.cache.find(ch => ch.id == logroom)
           await theroom.send({embeds:[doneembedprove]}).catch((err) => {console.log('error : ' , err)})

            // انشاء ايمبد لوج لعملية الشراء و جلب معلومات روم اللوج في السيرفر الرسمي و ارسال الايمبد هناك
            const { WebhookClient } = require('discord.js')
            const { purchaseWebhookUrl } = require('../../config.json');
            const webhookClient = new WebhookClient({ url : purchaseWebhookUrl });
            await webhookClient.send({embeds : [purchaseEmbeds]});

         })
         collector.on(`end` , async() => {
          try {
            transfermessage.delete().catch(async() => {return;})
          } catch (error) {
            return;
          }
         })

        }
    }
  }
}