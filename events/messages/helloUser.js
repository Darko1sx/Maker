const { Client, Collection,ActivityType, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
let {mainguild} = require('../../config.json')
module.exports = {
	name: Events.MessageCreate,
	execute: async(message) => {
        let client = message.client
        if(message.content == `<@${client.user.id}>`) {
            if(message.author.bot) return;
            return message.reply({content:`**Hello In <@${client.user.id}> , Im Using / Commands**`})
        }
        
  }};
