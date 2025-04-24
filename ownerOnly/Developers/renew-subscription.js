const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");const { Database } = require("st.db")
const db = new Database("/database/settings")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tokens = new Database("/database/tokens")
const { clientId,owner} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('renew-subscription')
    .setDescription('تجديد اشتراك')
    .addStringOption(Option => Option
        .setName(`type`)
        .setDescription(`نوع الاشتراك`)
        .setRequired(true)
        .addChoices(
            {
                name:`Prime` , value:`tier1`
            },
            {
                name:`Premium` , value:`tier2`
            },
            {
                name:`Ultimate` , value:`tier3`
            }
        ))
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
       const type = interaction.options.getString(`type`)
       const serverid = interaction.options.getString(`serverid`)
       const days = interaction.options.getInteger(`days`)
       let subsearch = 0;
       if(type == 'tier1') {
        subsearch = tier1subscriptions.get(`${type}_subs`)
    }else if(type == 'tier2') {
        subsearch = tier2subscriptions.get(`${type}_subs`)
    } else if(type == 'tier3') {
        subsearch = tier3subscriptions.get(`${type}_subs`)
       }
       const serversearch = subsearch.find(su => su.guildid == serverid)
       if(!serversearch) {
        return interaction.reply({content:`**لم يتم العثور على اشتراك بهذا الايدي**`})
       }
       const daysByHours = Math.floor(parseInt(days) * 24)
       const daysByMins = Math.floor(parseInt(daysByHours) * 60)
       const daysBySecs = Math.floor(parseInt(daysByMins) * 60)
       let {ownerid , guildid , timeleft} = serversearch;
       timeleft = timeleft + daysBySecs
       serversearch.timeleft = timeleft
       if(type == 'tier1') {
        await tier1subscriptions.set(`${type}_subs` , subsearch)
    }else if(type == 'tier2') {
        await tier2subscriptions.set(`${type}_subs` , subsearch)
    } else if(type == 'tier3') {
        await tier3subscriptions.set(`${type}_subs` , subsearch)
       }
       const doneembed = new EmbedBuilder()
       .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
        .setTitle(`**تم تجديد الاشتراك واضافة الوقت بنجاح**`)
        .setDescription(`**عدد الايام المتبقية الأن : \`${Math.floor((timeleft / 60) / (60) / (24))}\`**`)
       return interaction.reply({embeds:[doneembed]})
    }
}