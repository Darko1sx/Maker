const { ChatInputCommandInteraction , Client , SlashCommandBuilder, EmbedBuilder ,ButtonStyle, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/Broadcast2DB.json")
const Broadcast2DB = new Database("/Json-db/Bots/Broadcast2DB.json")
module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('bc')
    .setDescription('ارسال بانل البرودكاست'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
async execute(interaction , client) {
    await interaction.deferReply();
    let guildId = interaction.guild.id
    let admin_role = await Broadcast2DB.get(`admin_role_${guildId}`);
    if(!admin_role) return;
    if(!interaction.member.roles.cache.some(role => role.id == admin_role)) return interaction.editReply({content : `❌ | انت لست ادمن في البوت. يجب على مالك البوت استخدام امر \`/select-admin-role\``});

    let embed1 = new EmbedBuilder()
                        .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
                        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
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
return interaction.editReply({embeds:[embed1] , components:[row]})		
}
}