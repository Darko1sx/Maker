const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");const { Database } = require("st.db")
const db = new Database("/database/settings")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tier3subscriptionsplus = new Database("/database/makers/tier3/plus")

const tokens = new Database("/database/tokens")
const { clientId,owner} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('upgrade-to-plus')
    .setDescription('تجديد اشتراك')
    .addStringOption(Option => Option
        .setName(`serverid`)
        .setDescription(`ايدي السيرفر`)
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`days`)
            .setDescription(`الايام`)
            .setRequired(true))
    ,
    async execute(interaction) {
       if(!owner.includes(interaction.user.id)) return;
       const serverid = interaction.options.getString(`serverid`)
       const days = interaction.options.getInteger(`days`)
       let subsearch = tier3subscriptions.get(`tier3_subs`)
       const serversearch = subsearch.find(su => su.guildid == serverid)
       if(!serversearch) {
        return interaction.reply({content:`**لم يتم العثور على اشتراك بهذا الايدي**`})
       }
       const daysByHours = Math.floor(parseInt(days) * 24)
       const daysByMins = Math.floor(parseInt(daysByHours) * 60)
       const daysBySecs = Math.floor(parseInt(daysByMins) * 60)
       let pluss = tier3subscriptionsplus.get(`plus`)
       if(!pluss) {
           await tier3subscriptionsplus.set(`plus` , [])
        }
        pluss = tier3subscriptionsplus.get(`plus`)
        let serverPlus = pluss.find(plu => plu.guildid == serverid)
        if(!serverPlus) {
            await tier3subscriptionsplus.push(`plus` , {guildid:serverid , timeleft:daysBySecs})
        } else if(serverPlus) {
            let {timeleft} = serverPlus;
            serverPlus.timeleft = timeleft + daysBySecs
            await tier3subscriptionsplus.set(`plus` , pluss)
        }
        pluss = tier3subscriptionsplus.get(`plus`)
        serverPlus = await pluss.find(plu => plu.guildid == serverid)
        let {timeleft} = serverPlus;
       const doneembed = new EmbedBuilder()
       .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
        .setTitle(`**تم التطوير الي التيميت بلس واضافة الوقت بنجاح**`)
        .setDescription(`**الوقت المتبقي : \`${timeleft / 60 / 60 / 24 ?? days / 60 / 60 / 24}\`**`)
       return interaction.reply({embeds:[doneembed]})
    }
}