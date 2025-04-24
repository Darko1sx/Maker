const { Client, Collection,ActivityType, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const axios = require('axios');
const cloudscraper = require('cloudscraper');
const keepAlive = require('keep-alive')
const usersdata = new Database(`/database/usersdata/usersdata`);
const uptimeDB = new Database("/Json-db/Bots/uptimeDB.json")
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        setInterval(async() => {
            let uptimes = await uptimeDB.get(`uptimes`);
            if(!uptimes) return;
            if(uptimes.length <= 0) return;
            uptimes.forEach(async(uptime) => {
                let {url , type , guildId , userId , timeLeft} = uptime;
                let theGuild = client.guilds.cache.find(gu => gu.id == guildId)
                timeLeft = parseInt(timeLeft) - 180;
                 uptime.timeLeft = timeLeft;
                 await uptimeDB.set(`uptimes` , uptimes)
                 if(timeLeft == 86400) {
                    let userbalance = parseInt(usersdata.get(`balance_${userId}_${guildId}`))
                    let price = 0;
                    if(type == 'weekly') {
                        price = 35
                    }else if(type == "monthly") {
                        price = 100
                    }
                    if(userbalance < price) {
                        let oneDayLeft = new EmbedBuilder()
                        .setTitle(`**تبقى يوم واحد فقط**`)
                        .setDescription(`**تبقى يوم واحد فقط على انتهاء الابتايم الخاص بك ولا يوجد لديك رصيد للتجديد الرجاء شحن الرصيد حتى لا يتم حذف الرابط الخاص بك**`)
                        .setTimestamp()
                        .setThumbnail(theGuild.iconURL({dynamic:true}))
                        let theUser = theGuild.members.cache.find(mem => mem.id == userId);
                        await theUser.send({embeds:[oneDayLeft]});
                    }
                 }
                 if(timeLeft <= 0) {
                    let userbalance = parseInt(usersdata.get(`balance_${userId}_${guildId}`))
                    let price = 0;
                    if(type == 'weekly') {
                        price = 35
                    }else if(type == "monthly") {
                        price = 100
                    }
                    if(userbalance < price) {
                        let uptimeEnded = new EmbedBuilder()
                        .setTitle(`**انتهى الابتايم الخاص بك**`)
                        .setDescription(`**انتهى الابتايم الخاص بك وفشل التجديد بسبب عدم وجود رصيد كافي وتم حذف الرابط**`)
                        .setTimestamp()
                        .setThumbnail(theGuild.iconURL({dynamic:true}))
                        let theUser = theGuild.members.cache.find(mem => mem.id == userId);
                        await theUser.send({embeds:[uptimeEnded]});
                        let filtered = await uptimes.filter(up => up.url != url);
                        await uptimeDB.set(`uptimes` , filtered)
                        keepAlive.remove(url);
                    }else if(userbalance > price) {
                        const newbalance = parseInt(userbalance) - parseInt(price)
                        await usersdata.set(`balance_${userId}_${guildId}` , newbalance)
                        let newTimeLeft = 0;
                        if(type == 'weekly') {
                            newTimeLeft = 60 * 60 * 24 * 7
                        }else if(type == "monthly") {
                            newTimeLeft = 60 * 60 * 24 * 30
                        }
                        uptime.timeLeft = newTimeLeft;
                        await uptimeDB.set(`uptimes` , uptimes)
    
                    }
                 }
                await axios.get(url).catch(async() => {return;})
                await cloudscraper.get(url).catch(async() => {return;})
            })
        }, 1000 * 60 * 3);
	},
};