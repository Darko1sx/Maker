const { ChatInputCommandInteraction, Client, SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting")

module.exports = {
    ownersOnly: true,
    mainGuildOnly : true,
    data: new SlashCommandBuilder()
        .setName('change-balance-price')
        .setDescription('تغيير سعر العملة')
        .addIntegerOption(option => 
            option
                .setName('price')
                .setDescription('السعر بالكريدت')
                .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });
        const price = interaction.options.getInteger('price');

        await setting.set(`balance_price_${interaction.guild.id}`, price);
        return interaction.editReply({ content: `**تم تغيير سعر العملة بنجاح**` });
        
    }
};
