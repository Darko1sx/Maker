const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")

let db = new Database("/Json-db/Bots/azkarDB.json")

module.exports ={
    ownersOnly:true,

    data: new SlashCommandBuilder()
    .setName('set-prayers-room')
    .setDescription('تحديد روم الأدعية')
    .addChannelOption(Option => Option
        .setName(`room`)
        .setDescription(`روم الادعية`)
        .setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField .Flags.Administrator)) return interaction.reply({content:`**انت لا تمتلك صلاحية الادمن لاستخدام هذا الامر **` , ephemeral:true})

       let room = interaction.options.getChannel(`room`)
       await db.set(`prayers_room_${interaction.guild.id}` , room.id)
       let embed1 = new EmbedBuilder()
       .setTimestamp()
       .setTitle(`**تم تحديد روم الأدعية بنجاح سيتم ارسال الادعية كل 5 دقائق**`)
       return interaction.reply({embeds:[embed1]})
    }
}