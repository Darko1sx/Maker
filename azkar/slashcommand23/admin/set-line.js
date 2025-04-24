const { ChatInputCommandInteraction , Client , SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const isImage = require('is-image-header');
const { Database } = require("st.db")
let db = new Database("/Json-db/Bots/azkarDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('set-azkar-line')
    .setDescription('تحديد خط الاذكار')
    .addStringOption(Option => 
        Option
        .setName('line')
        .setDescription('الخط')
        .setRequired(true)), // or false
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
async execute(interaction) {
    try{
            await interaction.deferReply();
            const line = await interaction.options.getString(`line`)

                const example1 = await isImage(line);
                if(example1.success === true && line.includes('postimg.cc')){
                    await db.set(`azkar_line_${interaction.guild.id}` , line)
                    let embed = new EmbedBuilder()
                    .setDescription(`**تم تحديد الخط**`)
                    .setColor('Green')
                    .setImage(line)
                    .setTimestamp()
                    .setFooter({text : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})});
                    return interaction.editReply({embeds : [embed]})
                }else{
                    return interaction.editReply({embeds : [new EmbedBuilder().setDescription(`**نظرا لانتهاء صلاحية روابط الديسكورد في اقل من 24 ساعة \n - يرجى رفع الخط على هذا الموقع : https://postimages.org/ \n - اتبع الشرح في الاسفل :**`).setColor('Red').setImage(`https://s12.gifyu.com/images/SYShX.gif`).setTimestamp().setFooter({text : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})]})
                }
    } catch(err) {
        console.log(err)
        return interaction.editReply({content : `** لقد حدث خطا اتصل بالادارة **`});
    }
}
}