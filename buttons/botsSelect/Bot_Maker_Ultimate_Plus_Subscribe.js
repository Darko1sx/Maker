const { Interaction , SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js")
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tier3subscriptionsplus = new Database("/database/makers/tier3/plus")
const {mainguild} = require('../../config.json')
const buyStatusDB = new Database("Json-db/Others/buyStatus")

;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isStringSelectMenu()) {
        if(interaction.customId == 'select_bot') {
          let selected = interaction.values[0]
          if(selected == "Bot_Maker_Ultimate_Plus_Subscribe") {
              await interaction.deferReply({ephemeral : true});
              await interaction.editReply({content : `**لشراء خطة ميكر Ultimate Plus، تأكد أولاً من أنك تمتلك خطة Ultimate بالفعل. ثم توجه إلى تذكرة الدعم الفني لشراء الخطة Plus. 💼✨**` , ephemeral : true})
          }
        }
    }
  }
}