const { Client, Collection,ActivityType, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
let {mainguild} = require('../../config.json')
const { Database } = require("st.db")
const ms = require("ms")
const cooldown = new Collection()
const setting = new Database("/database/settingsdata/setting")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

module.exports = {
	name: Events.GuildCreate,
	execute: async(guild) => {
        let subscriptions1 = tier1subscriptions.get(`tier1_subs`)
		let filtered = subscriptions1.find(a => a.guildid == guild.id)
		if(!filtered) {
			if(guild.id == mainguild) return;
			await guild.leave();
		}
        
  }};
