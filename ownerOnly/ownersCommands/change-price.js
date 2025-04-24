const { ChatInputCommandInteraction, Client, SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const prices = new Database("/database/settingsdata/prices.json");

const choices = ['balance' , 'apply', 'azkar', 'Broadcast', 'normalBroadcast', 'credit', 'tax', 'nadeko', 'Scammers', 'privateRooms', 'orders', 'Logs', 'giveaway', 'ticket', 'suggestions', 'system', 'shop', 'feedback', 'probot', 'protect', 'roles', 'blacklist', 'autoline', 'quran', 'shopRooms', 'one4all', 'bot_maker_premium', 'bot_maker', 'bot_maker_ultimate'];

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('change-price')
        .setDescription('تغيير سعر البوت')
        .addStringOption(option => 
            option
                .setName('bot-type')
                .setDescription('نوع البوت')
                .setRequired(true)
                .setAutocomplete(true))
        .addIntegerOption(option => 
            option
                .setName('price')
                .setDescription('السعر بالعملات')
                .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });
        const Bot_Type = interaction.options.getString('bot-type');
        const price = interaction.options.getInteger('price');

        //  اذا الاختيار لا يوجد في القائمة
        if (!choices.includes(Bot_Type)) {
            return interaction.editReply({ content: `**نوع البوت غير صالح**`, ephemeral: true });
        // اذا سعر العملة اقل من 1000 كريدت
        }else if(Bot_Type == "balance" && price < 1000){
            interaction.editReply({content : `**⚠️ لا يمكن تعديل سعر العملة ليصبح أقل من \`1000 كريت\`.**` , ephemeral : true})
        // اذا سعر البوتات اقل من 10 عملات
        }else if(Bot_Type !== "balance" && price < 30){
            interaction.editReply({content : `**⚠️ لا يمكن تعديل سعر أي بوت ليصبح أقل من \`30 عملة\`.**` , ephemeral : true})
        // تغيير السعر البوت او العملة
        }else if(Bot_Type == "bot_maker" && price < 150){
            interaction.editReply({content : `**⚠️ لا يمكن تعديل سعر الميكر ليصبح أقل من \`150 عملة\`.**`})
        }else if(Bot_Type == "bot_maker_premium" && price < 350){
            interaction.editReply({content : `**⚠️ لا يمكن تعديل سعر الميكر ليصبح أقل من \`350 عملة\`.**`})
        }else if(Bot_Type == "bot_maker_ultimate" && price < 500){
            interaction.editReply({content : `**⚠️ لا يمكن تعديل سعر الميكر ليصبح أقل من \`500 عملة\`.**`})
        }else{
            await prices.set(`${Bot_Type}_price_${interaction.guild.id}`, price);
            return interaction.editReply({ content: `**تم تغيير سعر البوت بنجاح**` });
        }
    },
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async autocomplete(interaction) {
        const value = interaction.options.getFocused().toLowerCase();
        
        const choices = ['balance' , 'apply', 'azkar', 'Broadcast', 'normalBroadcast', 'credit', 'tax', 'nadeko', 'Scammers', 'privateRooms', 'orders', 'Logs', 'giveaway', 'ticket', 'suggestions', 'system', 'shop', 'feedback', 'probot', 'protect', 'roles', 'blacklist', 'autoline', 'quran', 'shopRooms', 'one4all', 'bot_maker_premium', 'bot_maker', 'bot_maker_ultimate'];

        const filtered = choices.filter(choice => choice.toLowerCase().includes(value)).slice(0, 25);

        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice }))
        );
    }
};