const { SlashCommandBuilder, EmbedBuilder ,ButtonStyle, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db")
const creditDB = new Database("/Json-db/Bots/creditDB.json")
module.exports ={
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('add-credit')
    .setDescription('اضافة كريدت الى شخص')
    .addUserOption(Option => Option
        .setName(`user`)
        .setDescription(`الشخص`)
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`amount`)
            .setDescription(`الكمية`)
            .setRequired(true)),
    async execute(interaction, client) {
        const sent = await interaction.deferReply({ephemeral:false});
        const user = interaction.options.getUser(`user`)
        const amount = interaction.options.getInteger(`amount`)
        let embed1 = new EmbedBuilder()
        .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
        let userCredits = creditDB.get(`credits_${user.id}_${interaction.guild.id}`)
        if(!userCredits) {
            await creditDB.set(`credits_${user.id}_${interaction.guild.id}` , 0)
        }
        userCredits = creditDB.get(`credits_${user.id}_${interaction.guild.id}`)
        let NewUserCredits = parseInt(userCredits) + parseInt(amount)
        await creditDB.set(`credits_${user.id}_${interaction.guild.id}` , NewUserCredits)
        embed1.setTitle(`**تم اضافة الكريدت الي الشخص بنجاح**`)
        embed1.setDescription(`**رصيد ${user} الحالي هو : \`${NewUserCredits}\`**`)
        return interaction.editReply({embeds:[embed1]})


    }
}