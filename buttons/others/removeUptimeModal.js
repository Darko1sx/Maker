const { SlashCommandBuilder,Collection,Events, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting")
const usersdata = new Database(`/database/usersdata/usersdata`)
const uptimeDB = new Database("/Json-db/Bots/uptimeDB.json")
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
      if(interaction.customId == 'removeUptimeModal') {
        let uptime_url = interaction.fields.getTextInputValue(`uptime_url`)
        let uptimes = uptimeDB.get(`uptimes`);
        if(!uptimes) return interaction.reply({content:`**لا يوجد روابط في المخزون للحذف**` , ephemeral:true})
        if(uptimes.length <= 0) return interaction.reply({content:`**لا يوجد روابط في المخزون للحذف**` , ephemeral:true})
        let uptimeFind = await uptimes.find(up => up.url == uptime_url)
        if(!uptimeFind) return interaction.reply({content:`**لم يتم العثور على هذا الرابط**` , ephemeral:true})
        let uptimeOwner = uptimeFind.userId
        if(interaction.user.id != uptimeOwner) return interaction.reply({content:`**انت لست مالك هذا الرابط**` , ephemeral:true})
        let filtered = await uptimes.filter(uptimers => uptimers.url != uptime_url)
        await uptimeDB.set(`uptimes` , filtered);
        return interaction.reply({content:`**تم حذف الرابط بنجاح**` , ephemeral:true})
      }
    }
  }
}