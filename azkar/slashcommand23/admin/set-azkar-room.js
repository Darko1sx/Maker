const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")

let db = new Database("/Json-db/Bots/azkarDB.json")

module.exports ={
    ownersOnly:true,

    data: new SlashCommandBuilder()
    .setName('set-azkar-room')
    .setDescription('تحديد روم الاذكار')
    .addChannelOption(Option => Option
        .setName(`room`)
        .setDescription(`روم الاذكار`)
        .setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField .Flags.Administrator)) return interaction.reply({content:`**انت لا تمتلك صلاحية الادمن لاستخدام هذا الامر **` , ephemeral:true})
       let room = interaction.options.getChannel(`room`)
       await db.set(`azkar_room_${interaction.guild.id}` , room.id)
       let embed1 = new EmbedBuilder()
       .setTimestamp()
       .setTitle(`**تم تحديد روم الاذكار بنجاح سيتم ارسال الاذكار كل 5 دقائق**`)
       return interaction.reply({embeds:[embed1]})
    }
}