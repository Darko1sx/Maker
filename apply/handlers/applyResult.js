const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector, Embed } = require("discord.js");
const { Database } = require("st.db")

const applyDB = new Database("/Json-db/Bots/applyDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

module.exports = (client13) => {
  client13.on(Events.InteractionCreate , async(interaction) =>{
    //if(interaction.isButton()) {
      if(interaction.isButton() && interaction.customId == "apply_accept") {
          const settings =  applyDB.get(`apply_settings_${interaction.guild.id}`)
          let applyroom = settings.applyroom;
        let appliesroom = settings.appliesroom;
        let resultsroom = settings.resultsroom;
        let adminrole = settings.adminrole;
            if(!interaction.member.roles.cache.has(`${adminrole}`)) return interaction.reply({content:`**لا تمتلك الصلاحية لفعل هذا**` , ephemeral:true})
            const receivedEmbed = interaction.message.embeds[0];
            const exampleEmbed = EmbedBuilder.from(receivedEmbed)
            const user = exampleEmbed.data.title
            let user2 = interaction.guild.members.cache.find(us => us.id == user)
            const findApply = await applyDB.get(`apply_${interaction.guild.id}`)
            let roleid = parseInt(findApply.roleid);
            let therole = await interaction.guild.roles.cache.find(ro => ro.id == roleid);
            await user2.roles.add(therole).then(async() => {
              if(applyDB.get(`dm_${interaction.guild.id}`) === true){
                const dm_embed = new EmbedBuilder()
                                      .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
                                      .setThumbnail(interaction.guild.iconURL({dynamic : true}))
                                      .setTitle('تم قبول تقديمك 🎊')
                                      .setDescription(`**> الاداري : ${interaction.user}**`)
                                      .setColor('Green')
                user2.send({embeds : [dm_embed]}).catch(() => {})
              }
              let theresultsroom = interaction.guild.channels.cache.find(ch => ch.id == resultsroom);
              let embed = new EmbedBuilder()
              .setTimestamp()
              .setColor('Green')
              .setTitle(`**تم قبول تقديم**`)
              .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
              .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
              .setDescription(`**صاحب التقديم : ${user2} \n الاداري : ${interaction.user}**`)
              theresultsroom.send({content : `${user2}`, embeds:[embed]})
              const buttons = interaction.message.components[0].components;
              const accpet = new ButtonBuilder()
              .setCustomId(`apply_accept`)
              .setLabel(`قبول`)
              .setEmoji('☑️')
              .setStyle(ButtonStyle.Success)
              .setDisabled(true)
              const reject = new ButtonBuilder()
              .setCustomId(`apply_reject`)
              .setLabel(`رفض`)
              .setEmoji('✖️')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true)
              const reject_with_reason = new ButtonBuilder()
              .setCustomId(`apply_reject_with_reason`)
              .setLabel(`رفض مع سبب`)
              .setEmoji('💡')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true)
              const row = new ActionRowBuilder()
              .addComponents(accpet , reject , reject_with_reason);
              interaction.reply({content:`**تم قبول التقديم بنجاح**`})
              interaction.message.edit({components:[row]})
            })
            .catch(err => {return interaction.reply({content : `عذرا يرجى رفع رتبة البوت` , ephemeral : true})})
        }
        if(interaction.customId == "modal_reject_with_reason") {
          const settings =  applyDB.get(`apply_settings_${interaction.guild.id}`)
          let applyroom = settings.applyroom;
        let appliesroom = settings.appliesroom;
        let resultsroom = settings.resultsroom;
        let adminrole = settings.adminrole;
            if(!interaction.member.roles.cache.has(`${adminrole}`)) return interaction.reply({content:`**لا تمتلك الصلاحية لفعل هذا**` , ephemeral:true})
        let reason = interaction.fields.getTextInputValue(`reason`)
          const receivedEmbed = interaction.message.embeds[0];
          const exampleEmbed = EmbedBuilder.from(receivedEmbed)
          const user = exampleEmbed.data.title
            let user2 = interaction.guild.members.cache.find(us => us.id == user)
            let theresultsroom = interaction.guild.channels.cache.find(ch => ch.id == resultsroom);
            let embed = new EmbedBuilder()
            .setTimestamp()
            .setColor('Red')
            .setTitle(`**تم رفض تقديم**`)
            .setDescription(`** صاحب التقديم : ${user2} \n الاداري : ${interaction.user} \n\n السبب : \`${reason}\`**`)
            .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            await theresultsroom.send({embeds:[embed]})
            if(applyDB.get(`dm_${interaction.guild.id}`) === true){
              const dm_embed = new EmbedBuilder()
                                    .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
                                    .setThumbnail(interaction.guild.iconURL({dynamic : true}))
                                    .setTitle('تم رفض تقديمك 😥')
                                    .setDescription(`**> الاداري : ${interaction.user}** \n **> السبب : ${reason}**`)
                                    .setColor('Red')
              await user2.send({embeds : [dm_embed]}).catch(() => {})
            }
            const buttons = interaction.message.components[0].components;
            const accpet = new ButtonBuilder()
            .setCustomId(`apply_accept`)
            .setLabel(`قبول`)
            .setEmoji('☑️')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
            const reject = new ButtonBuilder()
            .setCustomId(`apply_reject`)
            .setLabel(`رفض`)
            .setEmoji('✖️')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
            const reject_with_reason = new ButtonBuilder()
            .setCustomId(`apply_reject_with_reason`)
            .setLabel(`رفض مع سبب`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji('💡')
            .setDisabled(true)
            const row = new ActionRowBuilder()
            .addComponents(accpet , reject , reject_with_reason);
            interaction.reply({content:`**تم رفض التقديم بنجاح**`})
            interaction.message.edit({components:[row]})
        }

        if(interaction.isButton() && interaction.customId == "apply_reject") {
          const settings =  applyDB.get(`apply_settings_${interaction.guild.id}`)
          let applyroom = settings.applyroom;
        let appliesroom = settings.appliesroom;
        let resultsroom = settings.resultsroom;
        let adminrole = settings.adminrole;
            if(!interaction.member.roles.cache.has(`${adminrole}`)) return interaction.reply({content:`**لا تمتلك الصلاحية لفعل هذا**` , ephemeral:true})
          const receivedEmbed = interaction.message.embeds[0];
          const exampleEmbed = EmbedBuilder.from(receivedEmbed)
          const user = exampleEmbed.data.title
            let user2 = interaction.guild.members.cache.find(us => us.id == user)
            let theresultsroom = interaction.guild.channels.cache.find(ch => ch.id == resultsroom);
            let embed = new EmbedBuilder()
            .setTimestamp()
            .setColor('Red')
            .setTitle(`**تم رفض تقديم**`)
            .setDescription(`**صاحب التقديم : ${user2} \n الاداري : ${interaction.user}**`)
            .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            await theresultsroom.send({embeds:[embed]})
            if(applyDB.get(`dm_${interaction.guild.id}`) === true){
              const dm_embed = new EmbedBuilder()
                                    .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
                                    .setThumbnail(interaction.guild.iconURL({dynamic : true}))
                                    .setTitle('تم رفض تقديمك 😥')
                                    .setDescription(`**> الاداري : ${interaction.user}**`)
                                    .setColor('Red')
              await user2.send({embeds : [dm_embed]}).catch(() => {})
            }
            const buttons = interaction.message.components[0].components;
            const accpet = new ButtonBuilder()
            .setCustomId(`apply_accept`)
            .setLabel(`قبول`)
            .setEmoji('☑️')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
            const reject = new ButtonBuilder()
            .setCustomId(`apply_reject`)
            .setLabel(`رفض`)
            .setEmoji('✖️')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
            const reject_with_reason = new ButtonBuilder()
            .setCustomId(`apply_reject_with_reason`)
            .setLabel(`رفض مع سبب`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji('💡')
            .setDisabled(true)
            const row = new ActionRowBuilder()
            .addComponents(accpet , reject , reject_with_reason);
            interaction.reply({content:`**تم رفض التقديم بنجاح**`})
            interaction.message.edit({components:[row]})
        }
    //}
})
};  