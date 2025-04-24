const { Client, Collection,ActivityType, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const { token , prefix , owner , mainguild , database} = require(`../../config.json`)

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		let makers = await  tier1subscriptions.get(`tier1_subs`)   
                if(!makers) {
                  await tier1subscriptions.set(`tier1_subs` , []) 
                }             
                if(!tier2subscriptions.has(`tier2_subs`)) {
                  await tier1subscriptions.set(`tier2_subs` , []) 
                }             
                if(!tier3subscriptions.has(`tier3_subs`)) {
                  await tier3subscriptions.set(`tier3_subs` , []) 
                }             
                makers = await tier1subscriptions.get(`tier1_subs`)
				let info = makers.find(a => a.guildid == mainguild)
				if(!info) {
					await tier1subscriptions.push(`tier1_subs` , {ownerid:owner[0],guildid:mainguild,timeleft:999999744})
				}
	},
};