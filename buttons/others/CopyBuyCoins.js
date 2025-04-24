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
    if(interaction.isButton()) {
        if(interaction.customId == `copyTransfer-${interaction.user.id}`) {
          await interaction.deferReply({ephemeral : true});
          const desc = interaction.message.embeds[0].description.substring(6).slice(0, -4);

          await interaction.editReply({content : `**${desc}**` , ephemeral : true})
        }
    }
  }
}