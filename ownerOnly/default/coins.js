const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const { mainguild , commandsRoom} = require('../../config.json');

const usersdata = new Database(`/database/usersdata/usersdata`)
module.exports ={
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('coins')
    .setDescription('روئية رصيدك او رصيد شخص اخر')
    .addUserOption(Option => Option
        .setName(`user`)
        .setDescription(`الشخص`)
        .setRequired(false)),
    async execute(interaction, client) {
        if(interaction.guild.id == mainguild && interaction.channel.id !== commandsRoom) return interaction.reply({content : `** جميع الاوامر هنا <#${commandsRoom}> **` , ephemeral : true})

        await interaction.deferReply({ephemeral:false})
        const user = interaction.options.getUser(`user`) ?? interaction.user
        let userbalance = usersdata.get(`balance_${user.id}_${interaction.guild.id}`) ?? 0;
        let balanceembed = new EmbedBuilder()
        .setDescription(`**رصيد ${user} الحالي هو : \`${userbalance}\`**`)
        .setColor('Aqua')
        .setTimestamp()
        return interaction.editReply({embeds:[balanceembed]})
 
    }
}