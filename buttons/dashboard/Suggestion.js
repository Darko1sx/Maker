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
        if(interaction.customId == 'Suggestion') {          
          const modal = new ModalBuilder().setCustomId('SuggestionModalSubmit').setTitle('Suggestion');
            
          const SuggestionInp = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('SuggestionValue').setLabel('الاقتراح').setPlaceholder(`شكرًا لاقتراحك! يرجى توضيحه بتفصيل أكبر لنتمكن من تحقيقه. نحن متحمسون لتطوير خدماتنا بمساعدتك.`).setStyle(TextInputStyle.Paragraph));

          await modal.addComponents(SuggestionInp);
          await interaction.showModal(modal)
        }
    }

    if(interaction.isModalSubmit()){
        if(interaction.customId == 'SuggestionModalSubmit'){
            await interaction.deferReply({ephemeral:true})
            // جلب معلومات المشكله و استخدامه
            const Suggestion = interaction.fields.getTextInputValue(`SuggestionValue`);
            const reportEmbed = new EmbedBuilder()
                                        .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                        .setThumbnail(interaction.client.user.displayAvatarURL({dynamic : true}))
                                        .setTitle('New Suggestion')
                                        .setFooter({text : `Reported By : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                                        .setColor('#00FFFF')
                                        .addFields(
                                            {name : `اسم السيرفر` , value : `\`${interaction.guild.name}\`` , inline : true},
                                            {name : `صاحب السيرفر` , value : `\`${interaction.guild.ownerId}\`` , inline : true},
                                            {name : `صاحب الاقتراح` , value : `\`${interaction.user.id}\`` , inline : true},
                                            {name : `الاقتراح` , value : `\`\`\`${Suggestion}\`\`\`` , inline : true},
                                        )

            try {
              const { WebhookClient } = require('discord.js')
              const { suggestionsLogsWebhookUrl } = require('../../config.json');
              const webhookClient = new WebhookClient({ url : suggestionsLogsWebhookUrl });
              await webhookClient.send({embeds : [reportEmbed]});
                
            } catch (error) {
                console.log(error.message)
            }

            
            return await interaction.editReply({content : `` , embeds : [new EmbedBuilder().setDescription(`> **🙏 شكرًا لك على اقتراحك! نقدر تفاعلك واهتمامك في تحسين خدماتنا. 💡 يسعدنا أن نسمع أفكارك ونحن متحمسون للاطلاع عليها والعمل على تحقيقها.**`).setColor('Green').setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })] , components : [] , ephemeral : true}) 
        }
    }
  }
}