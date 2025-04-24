const { Message , Client, Collection,ActivityType, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle } = require("discord.js");
let { owner , prefix} = require('../../config.json')

module.exports = {
	name: Events.MessageCreate,
    /**
     * 
     * @param {Message} message 
     * @returns 
     */
	execute: async(message) => {
        if(message.author.bot)return;
        if(owner.includes(message.author.id)){
            if(message.content == prefix + "invite"){
                const embed = new EmbedBuilder()
                                        .setColor(`#d5d5d5`)
                                        .setTimestamp()
                                        .setTitle('➡️ INVITE ME')
                                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${message.client. user.id}&permissions=0&scope=bot`)
                                        .setAuthor({name : message.guild.name , iconURL : message.guild.iconURL({dynamic : true}) });
                await message.channel.send({embeds : [embed]});
                await message.react(`✅`);
            }
        }else{
            return;
        }
  }};
