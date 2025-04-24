const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  MessageComponentCollector,
  ButtonStyle,
} = require("discord.js");
const { Database } = require("st.db");
const applyDB = new Database("/Json-db/Bots/applyDB.json");
const tokens = new Database("/tokens/tokens");
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions");

module.exports = {
  ownersOnly: true,
  data: new SlashCommandBuilder()
    .setName("dm-mode")
    .setDescription("ارسال رسالة لخاص المتقدم عند الرفض او القبول")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("تفعيل / تعطيل نظام الخاص")
        .addChoices(
        {name : 'تفعيل' , value : 'enable'},
        {name : 'تعطيل' , value : 'disable'},
)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const sent = await interaction.deferReply({
      fetchReply: true,
      ephemeral: false,
    });
    let embed1 = new EmbedBuilder()
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setColor('Grey');
    let type = interaction.options.getString(`type`);
    if(type === "enable"){
        applyDB.set(`dm_${interaction.guild.id}` , true)
        embed1.setTitle(`**تم تفعيل نظام الخاص**`)
    }else if(type === "disable"){
        applyDB.set(`dm_${interaction.guild.id}` , false)
        embed1.setTitle(`**تم تعطيل نظام الخاص**`)
    }
    return interaction.editReply({ embeds: [embed1] });
  },
};