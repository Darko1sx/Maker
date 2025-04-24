
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message,ModalBuilder,TextInputBuilder,TextInputStyle } = require("discord.js");
const { Database } = require("st.db")
const Broadcast2DB = new Database("/Json-db/Bots/Broadcast2DB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


  let Broadcast2 = tokens.get('Broadcast2')
  if(!Broadcast2) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
Broadcast2.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client18 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildPresences,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});  client18.commands = new Collection();
  require(`./handlers/events`)(client18);
  client18.events = new Collection();
  require(`../../events/requireBots/Broadcast-commands`)(client18);
  const rest = new REST({ version: '10' }).setToken(token);
  client18.setMaxListeners(1000)

  client18.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client18.user.id),
          { body: Broadcast2SlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client18.once('ready', () => {
    client18.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`normal BC bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client18.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`Broadcast2`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client18.users.cache.get(owner) || await client18.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : برودكاست عادي\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`Broadcast2`, filtered);
          await client18.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`../Broadcast/handlers/events`)(client18)

  const folderPath = path.join(__dirname, 'slashcommand18');
  client18.Broadcast2SlashCommands = new Collection();
  const Broadcast2SlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("Broadcast2 commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          Broadcast2SlashCommands.push(command.data.toJSON());
          client18.Broadcast2SlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand18');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/normal-broadcast-commands`)(client18)
require("./handlers/events")(client18)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client18.once(event.name, (...args) => event.execute(...args));
	} else {
		client18.on(event.name, (...args) => event.execute(...args));
	}
	}

client18.on("messageCreate" , async(message) => {
    if(message.content != `${prefix}bc`) return;
  let guildId = message.guild.id
  let admin_role = await Broadcast2DB.get(`admin_role_${guildId}`);
  if(!admin_role) return;
  if(!message.member.roles.cache.some(role => role.id == admin_role)) return;
let embed1 = new EmbedBuilder()
.setFooter({text:message.author.username , iconURL:message.author.displayAvatarURL({dynamic:true})})
  .setAuthor({name:message.guild.name , iconURL:message.guild.iconURL({dynamic:true})})
  .setTimestamp(Date.now())
  .setColor('#000000')
.setTitle(`**أختر المراد ارساله من القائمة**`)
  let button1 = new ButtonBuilder()
  .setStyle(ButtonStyle.Primary)
  .setLabel(`أرسال للجميع`)
  .setCustomId(`bc_all`)
  let button2 = new ButtonBuilder()
  .setStyle(ButtonStyle.Primary)
  .setLabel(`أرسال للمتصلين`)
  .setCustomId(`bc_online`)
  let button3 = new ButtonBuilder()
  .setStyle(ButtonStyle.Primary)
  .setLabel(`أرسال لغير المتصلين`)
  .setCustomId(`bc_offline`)
  let button4 = new ButtonBuilder()
  .setStyle(ButtonStyle.Primary)
  .setLabel(`أرسال لرتبة معينة`)
  .setCustomId(`selected_role`)
  let row = new ActionRowBuilder().addComponents(button1,button2,button3,button4)
return message.reply({embeds:[embed1] , components:[row]})			

})

  
client18.on("interactionCreate" , async(interaction) => {
  if(interaction.customId === "help_general"){
    const embed = new EmbedBuilder()
        .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
        .setTitle('قائمة اوامر البوت')
        .setDescription('**لا توجد اوامر في هذا القسم حاليا**')
        .setTimestamp()
        .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
        .setColor('DarkButNotBlack');
    const btns = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐').setDisabled(true),
        new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Primary).setEmoji('👑'),
    )

    await interaction.update({embeds : [embed] , components : [btns]})
  }else if(interaction.customId === "help_owner"){
    const embed = new EmbedBuilder()
    .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
    .setTitle('قائمة اوامر البوت')
    .addFields(
      {name : `\`/select-admin-role\`` , value : `لتحديد رتبة الادمن`},
      {name : `\`/bc\` | \`${prefix}bc\`` , value : `لارسال بانل البرودكاست`},
    )
    .setTimestamp()
    .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
    .setColor('DarkButNotBlack');
const btns = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐'),
    new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Primary).setEmoji('👑').setDisabled(true),
)

await interaction.update({embeds : [embed] , components : [btns]})
  }
})


  client18.on("interactionCreate" , async(interaction) => {
    let guildId = interaction.guild.id
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client18.Broadcast2SlashCommands.get(interaction.commandName);
	    
      if (!command) {

        return;
      }
      if (command.ownersOnly === true) {
        if (owner != interaction.user.id) {
          return interaction.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
        }
      }
      try {

        await command.execute(interaction);
      } catch (error) {
			return
		}
    }
    if (interaction.isButton()) {
      let admin_role = await Broadcast2DB.get(`admin_role_${guildId}`);
      if(!admin_role) return;
      if(!interaction.member.roles.cache.some(role => role.id == admin_role)) return;
      if(interaction.customId == "bc_all") {
          const modal = new ModalBuilder()
          .setCustomId('bc_all_members')
       .setTitle('ارسال رسالة لجميع الاعضاء');
          const message = new TextInputBuilder()
          .setCustomId('message')
          .setLabel("الرسالة")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(90)
          const firstActionRow = new ActionRowBuilder().addComponents(message);
          modal.addComponents(firstActionRow)
          await interaction.showModal(modal)
          await interaction.guild.members.fetch()
      }
      if(interaction.customId == "bc_online") {
          const modal = new ModalBuilder()
          .setCustomId('bc_online_members')
       .setTitle('ارسال رسالة للأعضاء المتصلين');
          const message = new TextInputBuilder()
          .setCustomId('message')
          .setLabel("الرسالة")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(90)
          const firstActionRow = new ActionRowBuilder().addComponents(message);
          modal.addComponents(firstActionRow)
          await interaction.showModal(modal)
          await interaction.guild.members.fetch()
      }
      if(interaction.customId == "bc_offline") {
          const modal = new ModalBuilder()
          .setCustomId('bc_offline_members')
       .setTitle(`ارسال رسالة للأعضاء الغير متصلين`);
          const message = new TextInputBuilder()
          .setCustomId('message')
          .setLabel("الرسالة")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(90)
          const firstActionRow = new ActionRowBuilder().addComponents(message);
          modal.addComponents(firstActionRow)
          await interaction.showModal(modal)
          await interaction.guild.members.fetch()
      }
      if(interaction.customId == "selected_role") {
          const modal = new ModalBuilder()
          .setCustomId('bc_selected_role')
       .setTitle('ارسال رسالة لرتبة معينة');
          const message = new TextInputBuilder()
          .setCustomId('message')
          .setLabel("الرسالة")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(90)
            const roleid = new TextInputBuilder()
          .setCustomId('roleid')
          .setLabel("ايدي الرتبة")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(90)
          const firstActionRow = new ActionRowBuilder().addComponents(message);
          const firstActionRow2 = new ActionRowBuilder().addComponents(roleid);
          modal.addComponents(firstActionRow)
          modal.addComponents(firstActionRow2)
          await interaction.showModal(modal)
          await interaction.guild.members.fetch()
      }
  }
  if(interaction.isModalSubmit()) {
      let admin_role = await Broadcast2DB.get(`admin_role_${guildId}`);
      if(!admin_role) return;
      if(!interaction.member.roles.cache.some(role => role.id == admin_role)) return;
      // الارسال لجميع الاعضاء الموجودين فالسيرفر
      if (interaction.customId == "bc_all_members") {
          await interaction.guild.members.fetch();
          const allMembers = interaction.guild.members.cache.filter(mem => !mem.user.bot).map(memb => memb.user.id);
          let done = 0;
          let failed = 0;
      
          let embed1 = new EmbedBuilder()
              .setTitle(`**حالة البرودكاست**`)
              .setDescription(`**⚪ العدد المراد الارسال اليه : ${allMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
              .setTimestamp()
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
      
          let theSend = await interaction.reply({ content : `** ℹ️ - البوت يرسل كل 10 ثواني لشخص وذلك لتقليل نسبة تبنيد البوت **` , embeds: [embed1] });
      
          for (let i = 0; i < allMembers.length; i++) {
              const member = allMembers[i];
              const theMember = interaction.guild.members.cache.find(ro => ro.user.id == member);
              const message = interaction.fields.getTextInputValue(`message`);
      
              setTimeout(async () => {
                  try {
                      await theMember.send({ content: `${theMember} - ${message}` });
                      done += 1;
                  } catch (error) {
                      failed += 1;
                  }
      
                  let embed1 = new EmbedBuilder()
                      .setTitle(`**حالة البرودكاست**`)
                      .setDescription(`**⚪ العدد المراد الارسال اليه : ${allMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                      .setTimestamp()
                      .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                  await theSend.edit({ embeds: [embed1] });
      
                  if (done + failed >= allMembers.length) {
                      let embed1 = new EmbedBuilder()
                          .setTitle(`**تم الانتهاء من الارسال للجميع**`)
                          .setDescription(`**⚪ العدد المراد الارسال اليه : ${allMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                          .setTimestamp()
                          .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                      await theSend.edit({content : ``, embeds: [embed1] });
                  }
              }, i * 10000); // 10 seconds delay
          }
      }
      // الارسال لجميع الاعضاء الاونلاين فالسيرفر
      if (interaction.customId == "bc_online_members") {
          await interaction.guild.members.fetch();
          const onlineMembers = [];
          
          interaction.guild.members.cache.forEach(member => {
              if (member.user.bot) return;
              if (member.presence == null) return;
              if (member.presence.status != "offline") {
                  onlineMembers.push(member.user.id);
              }
          });
          
          let done = 0;
          let failed = 0;
          
          let embed1 = new EmbedBuilder()
              .setTitle(`**حالة البرودكاست**`)
              .setDescription(`**⚪ العدد المراد الارسال اليه : ${onlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
              .setTimestamp()
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
              
          let theSend = await interaction.reply({content : `** ℹ️ - البوت يرسل كل 10 ثواني لشخص وذلك لتقليل نسبة تبنيد البوت **` ,  embeds: [embed1] });
          
          for (let i = 0; i < onlineMembers.length; i++) {
              const member = onlineMembers[i];
              const theMember = interaction.guild.members.cache.find(ro => ro.user.id == member);
              const message = interaction.fields.getTextInputValue(`message`);
              
              setTimeout(async () => {
                  try {
                      await theMember.send({ content: `${theMember} - ${message}` });
                      done += 1;
                  } catch (error) {
                      failed += 1;
                  }
                  
                  let embed1 = new EmbedBuilder()
                      .setTitle(`**حالة البرودكاست**`)
                      .setDescription(`**⚪ العدد المراد الارسال اليه : ${onlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                      .setTimestamp()
                      .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                      
                  await theSend.edit({ embeds: [embed1] });
                  
                  if (done + failed >= onlineMembers.length) {
                      let embed1 = new EmbedBuilder()
                          .setTitle(`**تم الانتهاء من الارسال للمتصلين**`)
                          .setDescription(`**⚪ العدد المراد الارسال اليه : ${onlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                          .setTimestamp()
                          .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                          
                      await theSend.edit({content : ``, embeds: [embed1] });
                  }
              }, i * 10000); // 10 seconds delay
          }
      }
      
      if (interaction.customId == "bc_offline_members") {
          await interaction.guild.members.fetch();
          const offlineMembers = [];
          
          interaction.guild.members.cache.forEach(member => {
              if (member.user.bot) return;
              if (member.presence == null) {
                  offlineMembers.push(member.user.id);
              }
          });
          
          let done = 0;
          let failed = 0;
          
          let embed1 = new EmbedBuilder()
              .setTitle(`**حالة البرودكاست**`)
              .setDescription(`**⚪ العدد المراد الارسال اليه : ${offlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
              .setTimestamp()
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
              
          let theSend = await interaction.reply({content : `** ℹ️ - البوت يرسل كل 10 ثواني لشخص وذلك لتقليل نسبة تبنيد البوت **` ,  embeds: [embed1] });
          
          for (let i = 0; i < offlineMembers.length; i++) {
              const member = offlineMembers[i];
              const theMember = interaction.guild.members.cache.find(ro => ro.user.id == member);
              const message = interaction.fields.getTextInputValue(`message`);
              
              setTimeout(async () => {
                  try {
                      await theMember.send({ content: `${theMember} - ${message}` });
                      done += 1;
                  } catch (error) {
                      failed += 1;
                  }
                  
                  let embed1 = new EmbedBuilder()
                      .setTitle(`**حالة البرودكاست**`)
                      .setDescription(`**⚪ العدد المراد الارسال اليه : ${offlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                      .setTimestamp()
                      .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                      
                  await theSend.edit({ embeds: [embed1] });
                  
                  if (done + failed >= offlineMembers.length) {
                      let embed1 = new EmbedBuilder()
                          .setTitle(`**تم الانتهاء من الارسال لغير المتصلين**`)
                          .setDescription(`**⚪ العدد المراد الارسال اليه : ${offlineMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                          .setTimestamp()
                          .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                          
                      await theSend.edit({content : ``, embeds: [embed1] });
                  }
              }, i * 10000); // 10 seconds delay
          }
      }
      
      if (interaction.customId == "bc_selected_role") {
          await interaction.guild.members.fetch();
          const roleid = interaction.fields.getTextInputValue(`roleid`);
          const selectedMembers = [];
          
          interaction.guild.members.cache.forEach(member => {
              if (member.user.bot) return;
              if (member.roles.cache.some(role => role.id == roleid)) {
                  selectedMembers.push(member.user.id);
              }
          });
          
          let done = 0;
          let failed = 0;
          
          let embed1 = new EmbedBuilder()
              .setTitle(`**حالة البرودكاست**`)
              .setDescription(`**⚪ العدد المراد الارسال اليه : ${selectedMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
              .setTimestamp()
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
              
          let theSend = await interaction.reply({content : `** ℹ️ - البوت يرسل كل 10 ثواني لشخص وذلك لتقليل نسبة تبنيد البوت **` ,  embeds: [embed1] });
          
          for (let i = 0; i < selectedMembers.length; i++) {
              const member = selectedMembers[i];
              const theMember = interaction.guild.members.cache.find(ro => ro.user.id == member);
              const message = interaction.fields.getTextInputValue(`message`);
              
              setTimeout(async () => {
                  try {
                      await theMember.send({ content: `${theMember} - ${message}` });
                      done += 1;
                  } catch (error) {
                      failed += 1;
                  }
                  
                  let embed1 = new EmbedBuilder()
                      .setTitle(`**حالة البرودكاست**`)
                      .setDescription(`**⚪ العدد المراد الارسال اليه : ${selectedMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                      .setTimestamp()
                      .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                      
                  await theSend.edit({ embeds: [embed1] });
                  
                  if (done + failed >= selectedMembers.length) {
                      let embed1 = new EmbedBuilder()
                          .setTitle(`**تم الانتهاء من الارسال للرتبة المحددة**`)
                          .setDescription(`**⚪ العدد المراد الارسال اليه : ${selectedMembers.length}\n🟢 تم الأرسال الى : ${done}\n🔴 فشل الارسال الى : ${failed}**`)
                          .setTimestamp()
                          .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                          
                      await theSend.edit({content : ``, embeds: [embed1] });
                  }
              }, i * 10000); // 10 seconds delay
          }
      }
  }
  } )

   client18.login(token)
   .catch(async(err) => {
    const filtered = Broadcast2.filter(bo => bo != data)
			await tokens.set(`Broadcast2` , filtered)
      console.log(`${clientId} Not working and removed `)
   });




























































})
