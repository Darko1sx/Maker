const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js")
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isStringSelectMenu()) {
        if(interaction.customId == 'uptime_select') {
          let selected = interaction.values[0]
          if(selected == "monthly_uptime") {
            let price1 = setting.get(`balance_price_${interaction.guild.id}`) ?? 1000;
           let recipient = setting.get(`recipient_${interaction.guild.id}`)
           let logroom =  setting.get(`log_room_${interaction.guild.id}`)
           let probot = setting.get(`probot_${interaction.guild.id}`)
           let clientrole = setting.get(`client_role_${interaction.guild.id}`)
           if(!price1 || !recipient || !logroom || !probot || !clientrole) return interaction.reply({content:`**لم يتم تحديد الاعدادات**` , ephemeral:true});
           let uptimePrice = 100;
           let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
		if(!userbalance) {
            await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , 0)
            }
            userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
        if(userbalance < uptimePrice) return interaction.reply({content:`**⛔ انت لا تمتلك الرصيد الكافي ، تحتاج الى \`${uptimePrice}\` عملات**` , ephemeral:true})
        const modal = new ModalBuilder()
        .setCustomId('BuyMonthlyUptime_Modal')
     .setTitle('Buy Monthly Uptime');
        const monthly_uptime = new TextInputBuilder()
        .setCustomId('monthly_uptime')
        .setLabel("الرابط")
          .setStyle(TextInputStyle.Short)
          .setMinLength(5)
          .setMaxLength(90)
        const firstActionRow = new ActionRowBuilder().addComponents(monthly_uptime);
        modal.addComponents(firstActionRow)
        await interaction.showModal(modal)
          }
        }
    }
  }
}