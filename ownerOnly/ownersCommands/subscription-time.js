const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");const { Database } = require("st.db")
const db = new Database("/database/settings")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tokens = new Database("/database/tokens")
const { clientId,owner} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('subscription-time')
    .setDescription('معرفة الوقت المتبقي اشتراك')
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
    ,
    async execute(interaction) {
        await interaction.deferReply({ephemeral:false})
       const type = interaction.options.getString(`type`)
       const serverid = interaction.options.getString(`serverid`)
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
        return interaction.editReply({content:`**لم يتم العثور على اشتراك بهذا الايدي**`})
       }
       const {timeleft} = serversearch
       const doneembed = new EmbedBuilder()
       .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
        .setTitle(`**الوقت المتبقي للاشتراك**`)
        .setDescription(`**\`${Math.floor((timeleft / 60) / (60) / (24))}\` يوم تقريبا**`)
       return interaction.editReply({embeds:[doneembed]})
    }
}