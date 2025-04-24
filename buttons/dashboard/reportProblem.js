const { Interaction , SlashCommandBuilder,Collection,Events, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting")
const db = new Database("/database/usersdata/codes")
const usersdata = new Database(`/database/usersdata/usersdata`)
const mainBot = require("../../index");
const { mainguild } = require('../../config.json');

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if(interaction.isButton()) {
        if(interaction.customId == 'ReportProblem') {          
          const modal = new ModalBuilder().setCustomId('ReportProblemModalSubmit').setTitle('Report Problem');
            
          const ProblemInp = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('ProblemValue').setLabel('المشكلة').setPlaceholder('يُرجى وصف مشكلتك بوضوح و قم بارفاق صور توضح المشكلة فهذا سيساعد المطورين في حلها بسرعة و كفاءة').setStyle(TextInputStyle.Paragraph));

          await modal.addComponents(ProblemInp);
          await interaction.showModal(modal)
        }
    }

    if(interaction.isModalSubmit()){
        if(interaction.customId == 'ReportProblemModalSubmit'){
            await interaction.deferReply({ephemeral:true})
            // جلب معلومات المشكله و استخدامه
            const Problem = interaction.fields.getTextInputValue(`ProblemValue`);
            const reportEmbed = new EmbedBuilder()
                                        .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                        .setThumbnail(interaction.client.user.displayAvatarURL({dynamic : true}))
                                        .setTitle('New Report Problem')
                                        .setFooter({text : `Reported By : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                                        .setColor('Red')
                                        .addFields(
                                            {name : `اسم السيرفر` , value : `\`${interaction.guild.name}\`` , inline : true},
                                            {name : `صاحب السيرفر` , value : `\`${interaction.guild.ownerId}\`` , inline : true},
                                            {name : `صاحب البلاغ` , value : `\`${interaction.user.id}\`` , inline : true},
                                            {name : `البلاغ` , value : `\`\`\`${Problem}\`\`\`` , inline : true},

                                        )

            try {
              const { WebhookClient } = require('discord.js')
              const { reportLogsWebhookUrl } = require('../../config.json');
              const webhookClient = new WebhookClient({ url : reportLogsWebhookUrl });
              await webhookClient.send({embeds : [reportEmbed]});
               
            } catch (error) {
                console.log(error.message)
            }

            
            return await interaction.editReply({content : `` , embeds : [new EmbedBuilder().setDescription(`> **✅ شكرًا لتواصلك معنا وتبليغك عن المشكلة. لقد استلمنا تفاصيل مشكلتك والصور المرفقة. سيقوم فريق المطورين بمراجعتها والعمل على حلها في أقرب وقت ممكن.**`).setColor('Green').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : [] , ephemeral : true}) 
        }
    }
  }
}