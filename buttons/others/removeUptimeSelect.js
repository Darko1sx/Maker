const { SlashCommandBuilder,Collection,Events,TextInputBuilder,TextInputStyle, EmbedBuilder,ModalBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting")
const usersdata = new Database(`/database/usersdata/usersdata`)
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isStringSelectMenu()) {
      if(interaction.customId == 'uptime_select') {
        let selected = interaction.values[0]
        if(selected == "delete_uptime") {
          const modal = new ModalBuilder()
            .setCustomId('removeUptimeModal')
			.setTitle('حذف ابتايم');
            const uptime_url = new TextInputBuilder()
            .setCustomId('uptime_url')
            .setLabel("الرابط")
            .setStyle(TextInputStyle.Short);
            const firstActionRow = new ActionRowBuilder().addComponents(uptime_url);
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal)
        }
      }
    }
  }
}