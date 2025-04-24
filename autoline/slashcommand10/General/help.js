const { SlashCommandBuilder, EmbedBuilder  , ChatInputCommandInteraction , Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('قائمة اوامر البوت'), // or false
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
async execute(interaction) {
    try {
        await interaction.deferReply();
        const embed = new EmbedBuilder()
                                .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                .setTitle('قائمة اوامر البوت')
                                .setDescription(`**يرجى اختيار القسم المراد معرفة اوامره**`)
                                .setTimestamp()
                                .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                                .setColor('DarkButNotBlack');
        const btns = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐'),
            new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Primary).setEmoji('👑'),
        )

        await interaction.editReply({embeds : [embed] , components : [btns]});
    } catch (error) {
        console.log("🔴 | Error in help autoline bot" , error)
    }
}
}