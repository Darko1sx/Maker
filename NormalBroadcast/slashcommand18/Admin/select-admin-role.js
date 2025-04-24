const { SlashCommandBuilder, EmbedBuilder ,ButtonStyle, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/Broadcast2DB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('select-admin-role')
    .setDescription('تحديد رتبة الادمن')
    .addRoleOption(Option => 
        Option
        .setName('role')
        .setDescription('الرتبة')
        .setRequired(true)),
async execute(interaction) {
    const role = interaction.options.getRole('role')
 let embed1 = new EmbedBuilder()
	    .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
	    .setTitle(`**تم تحديد الرتبة بنجاح**`)
    await db.set(`admin_role_${interaction.guild.id}` , role.id)
    interaction.reply({embeds:[embed1], ephemeral: false})


}
}