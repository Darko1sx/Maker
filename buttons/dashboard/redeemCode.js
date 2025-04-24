const { Interaction , SlashCommandBuilder,Collection,Events, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting")
const db = new Database("/database/usersdata/codes")
const usersdata = new Database(`/database/usersdata/usersdata`)
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if(interaction.isButton()) {
        if(interaction.customId == 'RedeemCodeModalShow') {          
          const modal = new ModalBuilder().setCustomId('RedeemCodeModalSubmit').setTitle('Redeem Code');
            
          const Codeinp = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('CodeValue').setLabel('الكود').setStyle(TextInputStyle.Short));

          await modal.addComponents(Codeinp);
          await interaction.showModal(modal)
        }
    }

    if(interaction.isModalSubmit()){
        if(interaction.customId == 'RedeemCodeModalSubmit'){
            await interaction.deferReply({ephemeral:true})
            // جلب معلومات الكود و استخدامه
            const code = interaction.fields.getTextInputValue(`CodeValue`);

            let codes = db.get(`codes_${interaction.guild.id}`)
            if(!codes) {
                await db.set(`codes_${interaction.guild.id}` , [])
            }
            codes = await db.get(`codes_${interaction.guild.id}`)
            if(!codes || codes.length <= 0) {
                return interaction.editReply({content:`**لا يوجد اكواد دعوة في هذا الخادم للاستخدام**`})
            }
          let codeFind = codes.find(re => re.code == code)
          if(!codeFind) return interaction.editReply({content:`**هذا الكود غير متوفر**`})
          let {usergift , maxuse , users , usersnow} = codeFind;
        if(users.includes(interaction.user.id)) return interaction.editReply({content:`**لقد قمت باستخدام هذا الكود مسبقا**`})
        if(usersnow == maxuse) return interaction.editReply({content:`**هذا الكود وصل لاقصى حد من الاستخدام**`})
          let authorbalance = usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`)
          if(!authorbalance) {
              await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , 0)
          }
          authorbalance = await usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`)
          let newauthorbalance = parseInt(authorbalance) + parseInt(usergift)
          await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newauthorbalance)
          const embed = new EmbedBuilder()
          .setTitle(`**تم استخدام الكود بنجاح**`)
          .setDescription(`**هديتك : \`${usergift}\` كوين**`)
          .setColor("Green")
          .setTimestamp()
          users.push(interaction.user.id)
          usersnow = parseInt(usersnow) + 1
          codeFind.users = users;
          codeFind.usersnow = usersnow;
          await db.set(`codes_${interaction.guild.id}` , codes)
          // ارسال رسالة في روم اللوج
          let doneembedprove = new EmbedBuilder()
          .setColor('Blue')
          .setDescription(`**تم استخدام كود خصم بقيمة \`${usergift}\` كوين بواسطة : <@${interaction.user.id}>**`)
          .setTimestamp()
          let logroom =  await setting.get(`log_room_${interaction.guild.id}`)
          if(logroom){
                let theroom = await interaction.guild.channels.cache.find(ch => ch.id == logroom)
                if(theroom){
                    await theroom.send({embeds:[doneembedprove]}).catch((err) => {console.log('error : ' , err)})
                }
           }
          return interaction.editReply({embeds:[embed]})
        }
    }
  }
}