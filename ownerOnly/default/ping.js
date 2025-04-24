const { ChatInputCommandInteraction , Client , SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { mainguild , commandsRoom} = require('../../config.json');

module.exports ={

    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Client Ping Test'),
        /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if(interaction.guild.id == mainguild && interaction.channel.id !== commandsRoom) return interaction.reply({content : `** جميع الاوامر هنا <#${commandsRoom}> **` , ephemeral : true})

        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const msg = sent.createdTimestamp - interaction.createdTimestamp;
        const api = Math.round(interaction.client.ws.ping);
        let states = "🟢 Excellent";
        let states2 = "🟢 Excellent";
        if (Number(msg) > 70) states = "🟢 Good";
        if (Number(msg) > 170) states = "🟡 Not Bad";
        if (Number(msg) > 350) states = "🔴 Soo Bad";
        if (Number(api) > 70) states2 = "🟢 Good";
        if (Number(api) > 170) states2 = "🟡 Not Bad";
        if (Number(api) > 350) states2 = "🔴 Soo Bad";

	    let embed1 = new EmbedBuilder()
                        .setFooter({text: `Requested by : ${interaction.user.username}` , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
                        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
                        .setColor('DarkBlue')
                        .addFields(
                            {name : `**Time Taken:**` , value : msg + " ms 📶 | " + states , inline : true},
                            {name : `**WebSocket:**` , value : api + " ms 📶 | " + states2 , inline : true}
                        )
        let btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('pingDis').setLabel(interaction.guild.name).setDisabled(true).setStyle(ButtonStyle.Secondary).setEmoji('✨'))
		return interaction.editReply({content : `` , embeds:[embed1] , components : [btn]})
 
    }
}