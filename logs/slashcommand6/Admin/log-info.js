const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/logsDB.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs-info')
        .setDescription('معلومات نظام اللوج في السيرفر'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        await interaction.deferReply();

        // الرسائل
        let messagedelete = await db.get(`log_messagedelete_${interaction.guild.id}`);
        let messageupdate = await db.get(`log_messageupdate_${interaction.guild.id}`);
        // الرتب
        let rolecreate = await db.get(`log_rolecreate_${interaction.guild.id}`);
        let roledelete = await db.get(`log_roledelete_${interaction.guild.id}`);
        let rolegive = await db.get(`log_rolegive_${interaction.guild.id}`);
        let roleremove = await db.get(`log_roleremove_${interaction.guild.id}`);
        // الرومات
        let channelcreate = await db.get(`log_channelcreate_${interaction.guild.id}`);
        let channeldelete = await db.get(`log_channeldelete_${interaction.guild.id}`);
        // البوتات
        let botadd = await db.get(`log_botadd_${interaction.guild.id}`);
        // الباند و الطرد كيك
        let banadd = await db.get(`log_banadd_${interaction.guild.id}`);
        let bandelete = await db.get(`log_bandelete_${interaction.guild.id}`);
        let kickadd = await db.get(`log_kickadd_${interaction.guild.id}`);

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle('**معلومات نظام اللوج**')
            .addFields(
                { name: `حذف رسالة`, value: `${messagedelete ? `<#${messagedelete}>` : '```غير محددة```'}` , inline : true},
                { name: `تحديث رسالة`, value: `${messageupdate ? `<#${messageupdate}>` : '```غير محددة```'}` , inline : true},
                { name: `\n`, value: `\n`, inline: true },
                { name: `إنشاء رتبة`, value: `${rolecreate ? `<#${rolecreate}>` : '```غير محددة```'}` , inline : true},
                { name: `حذف رتبة`, value: `${roledelete ? `<#${roledelete}>` : '```غير محددة```'}` , inline : true},
                { name: `إعطاء رتبة`, value: `${rolegive ? `<#${rolegive}>` : '```غير محددة```'}` , inline : true},
                { name: `إزالة رتبة`, value: `${roleremove ? `<#${roleremove}>` : '```غير محددة```'}` , inline : true},
                { name: `\n`, value: `\n`, inline: true },
                { name: `\n`, value: `\n`, inline: true },
                { name: `إنشاء قناة`, value: `${channelcreate ? `<#${channelcreate}>` : '```غير محددة```'}` , inline : true},
                { name: `حذف قناة`, value: `${channeldelete ? `<#${channeldelete}>` : '```غير محددة```'}` , inline : true},
                { name: `\n`, value: `\n`, inline: true },
                { name: `إضافة بوت`, value: `${botadd ? `<#${botadd}>` : '```غير محددة```'}` , inline : true},
                { name: `\n`, value: `\n`, inline: true },
                { name: `\n`, value: `\n`, inline: true },
                { name: `إضافة باند`, value: `${banadd ? `<#${banadd}>` : '```غير محددة```'}` , inline : true},
                { name: `حذف باند`, value: `${bandelete ? `<#${bandelete}>` : '```غير محددة```'}` , inline : true},
                { name: `طرد`, value: `${kickadd ? `<#${kickadd}>` : '```غير محددة```'}` , inline : true}
            )
            .setColor('Random')
            .setTimestamp()
            .setFooter({text : `Requeted by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})});

        await interaction.editReply({ embeds: [embed] });
    }
};
