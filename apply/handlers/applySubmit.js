const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector, Embed } = require("discord.js");
const { Database } = require("st.db")

const applyDB = new Database("/Json-db/Bots/applyDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
module.exports = (client13) => {
    client13.on(Events.InteractionCreate , async(interaction) =>{
    if(interaction.isModalSubmit() && interaction.customId == "modal_apply") {
        // الحصول على الاسئله
        const questions = applyDB.get(`apply_${interaction.guild.id}`);
        let qu_1 = questions.ask1 ?? 'غير محدد'
        let qu_2 = questions.ask2 ?? 'غير محدد'
        let qu_3 = questions.ask3 ?? 'غير محدد'
        let qu_4 = questions.ask4 ?? 'غير محدد'
        let qu_5 = questions.ask5 ?? 'غير محدد'

        // الحصول على الاجوبة و روم التقديمات
        const settings =  applyDB.get(`apply_settings_${interaction.guild.id}`)
        let appliesroom = settings.appliesroom

        let ask_1 = null;
        if(questions.ask1) ask_1 = interaction.fields.getTextInputValue(`ask_1`)
        let ask_2 = null;
        if(questions.ask2) ask_2 = interaction.fields.getTextInputValue(`ask_2`)
        let ask_3 = null;
        if(questions.ask3) ask_3 = interaction.fields.getTextInputValue(`ask_3`)
        let ask_4 = null;
        if(questions.ask4) ask_4 = interaction.fields.getTextInputValue(`ask_4`)
        let ask_5 = null;
        if(questions.ask5) ask_5 = interaction.fields.getTextInputValue(`ask_5`)
        

        let appliesroomsend = interaction.guild.channels.cache.find(ch => ch.id == appliesroom)

        let embedsend = new EmbedBuilder()
        .setTitle(`${interaction.user.id}`)
        .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
        // .addFields(
        //     {
        //         name:`**صاحب التقديم : **` , value:`**${interaction.user}**`,inline:false
        //     },
        //     {
        //         name:`**ايدي صاحب التقديم :**`,value:`${interaction.user.id}`,inline:false
        //     },
        //     {
        //         name:`**السوال الاول : ** ${qu_1}`,value:`\`\`\`${ask_1}\`\`\``,inline:false
        //     },
        //     {
        //         name:`**السوال الثاني : ** ${qu_2}`,value:`\`\`\`${ask_2}\`\`\``,inline:false
        //     },
        //     {
        //         name:`**السوال الثالث : ** ${qu_3}`,value:`\`\`\`${ask_3}\`\`\``,inline:false
        //     },
        //     {
        //         name:`**السوال الرابع : ** ${qu_4}`,value:`\`\`\`${ask_4}\`\`\``,inline:false
        //     },
        //     {
        //         name:`**السوال الخامس : ** ${qu_5}`,value:`\`\`\`${ask_5}\`\`\``,inline:false
        //     },
        //     {
        //         name:`**انضم للديسكورد منذ :**`,value:`> <t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`,inline:true
        //     },
        //     {
        //         name:`**انضم للسيرفر منذ :**`,value:`> <t:${parseInt(interaction.member.joinedAt / 1000)}:R>`,inline:true
        //     }
        // )
        .setTimestamp(Date.now())
        .setColor('Random')
        .setAuthor({name:interaction.user.username, iconURL:interaction.user.displayAvatarURL({dynamic:true})});

        if(ask_1 !== null){
            embedsend.addFields({name:`**السوال الاول : ** ${qu_1}`,value:`\`\`\`${ask_1}\`\`\``,inline:false})
        }
        if(ask_2 !== null){
            embedsend.addFields({name:`**السوال الثاني : ** ${qu_2}`,value:`\`\`\`${ask_2}\`\`\``,inline:false})
        }
        if(ask_3 !== null){
            embedsend.addFields({name:`**السوال الثالث : ** ${qu_3}`,value:`\`\`\`${ask_3}\`\`\``,inline:false})
        }
        if(ask_4 !== null){
            embedsend.addFields({name:`**السوال الرابع : ** ${qu_4}`,value:`\`\`\`${ask_4}\`\`\``,inline:false})
        }
        if(ask_5 !== null){
            embedsend.addFields({name:`**السوال الخامس : ** ${qu_5}`,value:`\`\`\`${ask_5}\`\`\``,inline:false})
        }

        embedsend.addFields(            
        {
            name:`**انضم للديسكورد منذ :**`,value:`> <t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`,inline:true
        },
        {
            name:`**انضم للسيرفر منذ :**`,value:`> <t:${parseInt(interaction.member.joinedAt / 1000)}:R>`,inline:true
        })

        const accpet = new ButtonBuilder()
        .setCustomId(`apply_accept`)
        .setLabel(`قبول`)
        .setEmoji('☑️')
        .setStyle(ButtonStyle.Success)
        const reject = new ButtonBuilder()
        .setCustomId(`apply_reject`)
        .setLabel(`رفض`)
        .setEmoji('✖️')
        .setStyle(ButtonStyle.Danger)
        const reject_with_reason = new ButtonBuilder()
        .setCustomId(`apply_reject_with_reason`)
        .setLabel(`رفض مع سبب`)
        .setEmoji('💡')
        .setStyle(ButtonStyle.Danger)
        const row = new ActionRowBuilder()
        .addComponents(accpet , reject , reject_with_reason);
        await interaction.reply({content:`**تم ارسال تقديمك بنجاح**` , ephemeral:true})
        return appliesroomsend.send({embeds:[embedsend] , components:[row]});
    }
})
};