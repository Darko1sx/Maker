const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js")
const { mainguild } = require('../../config.json');
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const buyStatusDB = new Database("Json-db/Others/buyStatus")

;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isStringSelectMenu()) {
        if(interaction.customId == 'select_bot2') {
          let selected = interaction.values[0]
          if(selected == "BuyOne4all") {
            if(buyStatusDB.get(`one4all`) === "off"){
              return interaction.reply({content : `***لا تستطيع شراء هذا البوت في الوقت الحالي***\n**تستطيع ان تحاول مره ثانيه عندما يكون متوفر**` , ephemeral : true})
            }
            // جلب بعض البيانات المهمة
           let price1 = setting.get(`balance_price_${interaction.guild.id}`) ?? 1000;
           let recipient = setting.get(`recipient_${interaction.guild.id}`)
           let logroom =  setting.get(`log_room_${interaction.guild.id}`)
           let probot = setting.get(`probot_${interaction.guild.id}`)
           let clientrole = setting.get(`client_role_${interaction.guild.id}`)
            // تحقق من خطة البوت
           if(interaction.guild.id != mainguild) {
            const subs3 = tier3subscriptions.get(`tier3_subs`) || [];
           const sub3 = subs3.find(su => su.guildid == interaction.guild.id)

           if(!sub3) {
            const invitebot = new ButtonBuilder().setLabel('السيرفر الرسمي').setURL(`https://discord.gg/tdvubCxu7Y`).setStyle(ButtonStyle.Link);
            const row2 = new ActionRowBuilder().addComponents(invitebot);
            return interaction.reply({ephemeral:true,content:`**توجه الى السيرفر الرسمي**` , components:[row2]})
           }
          }
           if(!price1 || !recipient || !logroom || !probot || !clientrole) return interaction.reply({content:`**لم يتم تحديد الاعدادات**` , ephemeral:true})
          let one4allPrice = parseInt(prices.get(`one4all_price_${interaction.guild.id}`))
          if(!one4allPrice) one4allPrice = 200;
        let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
		if(!userbalance) { await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , 0) }
    userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
        if(userbalance < one4allPrice) return interaction.reply({content:`**⛔ انت لا تمتلك الرصيد الكافي ، تحتاج الى \`${one4allPrice}\` عملات**` , ephemeral:true})
           const modal = new ModalBuilder()
          .setCustomId('BuyOne4all_Modal')
       .setTitle('Make One4all Bot');
          const Bot_token = new TextInputBuilder()
          .setCustomId('Bot_token')
          .setLabel("توكن البوت")
            .setStyle(TextInputStyle.Short)
            .setMinLength(40)
            .setMaxLength(90)
          const Bot_prefix = new TextInputBuilder()
          .setCustomId('Bot_prefix')
          .setLabel("البريفكس")
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(3)
          const firstActionRow = new ActionRowBuilder().addComponents(Bot_token);
          const firstActionRow2 = new ActionRowBuilder().addComponents(Bot_prefix);
          modal.addComponents(firstActionRow,firstActionRow2)
          await interaction.showModal(modal)
          }
        }
    }
  }
}