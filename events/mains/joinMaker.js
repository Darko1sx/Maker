const {  Events, EmbedBuilder, Guild } = require("discord.js");
const mainBot = require('../../index');
module.exports = {
    //guildCreate
	name: Events.GuildCreate,
        /**
     * @param {Guild} guild
     */
	execute: async(guild) => {
    const owner = await mainBot.users.fetch(guild.ownerId);
    const ownerUsername = owner ? owner.username : "Unknown";
    const { WebhookClient } = require('discord.js')
    const { joinLeaveWebhookUrl } = require('../../config.json');
    const webhookClient = new WebhookClient({ url : joinLeaveWebhookUrl });

    const joinsEmbed = new EmbedBuilder()
                            .setTitle("Bot Maker Prime")
                            .setColor("Blue")
                            .setDescription(`Joined: ${guild.name}\nOwner Mention: <@${guild.ownerId}>\nOwner user: ${ownerUsername}`);

    await webhookClient.send({ embeds: [joinsEmbed] }).catch(() => {return;});
  }};