const { Client, Collection,ActivityType, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
let {mainguild} = require('../../config.json')
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		try {
            let guilds = client.guilds.cache.forEach(async(guild) => {
            let subscriptions1 = tier1subscriptions.get(`tier1_subs`)
            if(!subscriptions1) {
                await tier1subscriptions.set(`tier1_subs` , [])
            }
                subscriptions1 = tier1subscriptions.get(`tier1_subs`)
            let filtered = subscriptions1.find(a => a.guildid == guild.id)
            if(!filtered) {
                if(guild.id == mainguild) return;
                await guild.leave();
            }
        })
        } catch (error) {
            return
        }
	},
};