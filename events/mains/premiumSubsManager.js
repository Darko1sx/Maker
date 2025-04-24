const { Client, Collection,ActivityType, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		setInterval(async() => {
            let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
        if(!BroadcastTokens)return;
        if(BroadcastTokens.length <= 0) return;
        BroadcastTokens.forEach(async(data) => {
            let {token , prefix , owner , timeleft} = data;
            if(timeleft > 0) {
                timeleft = timeleft - 1
                data.timeleft = timeleft
                await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
            }else if(timeleft <= 0) {
                const filtered = BroadcastTokens.filter(bo => bo != data)
                await tier2subscriptions.set(`tier2_subs` , filtered)
            }
        });
        },1000)
	},
};