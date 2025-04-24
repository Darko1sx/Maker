const { ChatInputCommandInteraction , Client , SlashCommandBuilder,SelectMenuBuilder,StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/database/data")
const setting = new Database("/database/settingsdata/setting")
const prices = new Database("/database/settingsdata/prices.json")
const statuses = new Database("/database/settingsdata/statuses")
const { mainguild } = require('../../config.json')

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('send-dashboard')
    .setDescription(`لارسال داشبورد للميكر`),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
async execute(interaction , client) {
    await interaction.deferReply({ephemeral:false})
    let dashboardRoom = await setting.get(`dashboard_room_${interaction.guild.id}`);
    if(!dashboardRoom) return interaction.editReply({content:`**لم يتم تحديد الاعدادات**`})
    let theroom = interaction.guild.channels.cache.find(ch => ch.id == dashboardRoom)
    if(!theroom) return interaction.editReply({content:`**تاكد من روم الداشبورد**`})

    const theBotMember = interaction.guild.members.cache.get(interaction.client.user.id);
    const botRole = theBotMember.displayHexColor || "Random";

    let embed = new EmbedBuilder()
                    .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                    .setTitle(`**🖥️ لوحة تحكم لبوتات الميكر**`)
                    .setDescription(`- **Redeem**
> يمكنك استخدام أكواد الخصم لاستلام المكافآت الخاصة بالكود.
- **My Bots**
> يمكنك مشاهدة جميع معلومات البوتات التي قمت بشرائها والتحكم فيها، بما في ذلك تجديد الاشتراك وتغيير معلومات البوت وغيرها.
- **Report Problem**
> يمكنك التبليغ عن أي مشكلة تواجهها في بوتات الميكر أو حتى الميكر نفسه.
- **Suggestion**
> يمكنك اقتراح أفكارك حول بوتات الميكر أو حتى الميكر نفسه. إذا أعجبنا اقتراحك، سنقوم بتنفيذه ومنحك مكافأة قيمة.
\`\`\`
أي استهتار يعرضك للإدراج في القائمة السوداء من خدمات الميكر
\`\`\`
`)
                    .setThumbnail(interaction.client.user.displayAvatarURL({dynamic : true}))

    let btns = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
                .setCustomId(`RedeemCodeModalShow`)
                .setLabel(`Redeem`)
                .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
                .setCustomId(`MyBots`)
                .setLabel(`My Bots`)
                .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
                .setCustomId(`ReportProblem`)
                .setLabel(`Report Problem`)
                .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
                .setCustomId(`Suggestion`)
                .setLabel(`Suggestion`)
                .setStyle(ButtonStyle.Secondary),
    )

    if(interaction.guild.id === mainguild){
        embed.setColor(`#00add9`);
    }else{
        embed.setColor(botRole)
    }

    await theroom.send({embeds : [embed] , components : [btns]})

    return interaction.editReply({content:`**تم ارسال الرسالة بنجاح**`})
}
}