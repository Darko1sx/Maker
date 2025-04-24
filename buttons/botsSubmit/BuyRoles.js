const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message , StringSelectMenuOptionBuilder , StringSelectMenuBuilder } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const rolesDB = new Database("/Json-db/Bots/rolesDB.json")
let roles = tokens.get(`roles`)
const path = require('path');
const { readdirSync } = require("fs");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "BuyRoles_Modal") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            const Bot_token = interaction.fields.getTextInputValue(`Bot_token`)
            const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`)
            const client25 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
            
            try{
                const owner = interaction.user.id
                let price1 = prices.get(`roles_price_${interaction.guild.id}`) || 70;
                price1 = parseInt(price1)
                function generateRandomCode() {
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let code = '';
                    for (let i = 0; i < 12; i++) {
                      if (i > 0 && i % 4 === 0) {
                        code += '-';
                      }
                      const randomIndex = Math.floor(Math.random() * characters.length);
                      code += characters.charAt(randomIndex);
                    }
                    return code;
                }
                const invoice = generateRandomCode();
                const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(Bot_token);
const { Routes } = require('discord-api-types/v10');
               client25.on("ready" , async() => {
                let doneembeduser = new EmbedBuilder()
                .setTitle(`**تم انشاء بوتك بنجاح**`)
                .setDescription(`**معلومات الفاتورة :**`)
                .addFields(
                    {
                        name:`**الفاتورة**`,value:`**\`${invoice}\`**`,inline:false
                    },
                    {
                        name:`**نوع البوت**`,value:`**\`شراء رتب\`**`,inline:false
                    },
                    {
                        name:`**توكن البوت**`,value:`**\`${Bot_token}\`**`,inline:false
                    },
                    {
                        name:`**البريفكس**`,value:`**\`${Bot_prefix}\`**`,inline:false
                    }
                    )
                    await invoices.set(`${invoice}_${interaction.guild.id}` , 
                    {
                        type:`شراء رتب`,
                        token:`${Bot_token}`,
                        prefix:`${Bot_prefix}`,
                        userid:`${interaction.user.id}`,
                        guildid:`${interaction.guild.id}`,
                        serverid:`عام`,
                    price:price1
                })
                const newbalance = parseInt(userbalance) - parseInt(price1)
await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
                const thebut = new ButtonBuilder().setLabel(`دعوة البوت`).setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client25.user.id}&permissions=8&scope=bot%20applications.commands`);const rowss = new ActionRowBuilder().addComponents(thebut);
                await interaction.user.send({embeds:[doneembeduser] , components:[rowss]})
            })
                let doneembedprove = new EmbedBuilder()
                .setColor('Aqua')
                .setDescription(`**تم شراء بوت \`شراء رتب\` بواسطة : ${interaction.user}**`)
                .setTimestamp()
                let logroom =  setting.get(`log_room_${interaction.guild.id}`)
                let theroom = interaction.guild.channels.cache.find(ch => ch.id == logroom)
                await theroom.send({embeds:[doneembedprove]})
                  // انشاء ايمبد لوج لعملية الشراء و جلب معلومات روم اللوج في السيرفر الرسمي و ارسال الايمبد هناك
                  const { WebhookClient } = require('discord.js')
                  const { purchaseWebhookUrl } = require('../../config.json');
                  const webhookClient = new WebhookClient({ url : purchaseWebhookUrl });
                  const theEmbed = new EmbedBuilder()
                                              .setColor('Green')
                                              .setTitle('تمت عملية شراء جديدة')
                                              .addFields(
                                                  {name : `نوع البوت` , value : `\`\`\`بيع رتب\`\`\`` , inline : true},
                                                  {name : `سعر البوت` , value : `\`\`\`${price1}\`\`\`` , inline : true},
                                                  {name : `المشتري` , value : `\`\`\`${interaction.user.username} , [${interaction.user.id}]\`\`\`` , inline : true},
                                                  {name : `السيرفر` , value : `\`\`\`${interaction.guild.name} [${interaction.guild.id}]\`\`\`` , inline : true},
                                                  {name : `صاحب السيرفر` , value : `\`\`\`${interaction.guild.ownerId}\`\`\`` , inline : true},
                                                  {name : `الفاتورة` , value : `\`\`\`${invoice}\`\`\`` , inline : false},
                                              )
                  await webhookClient.send({embeds : [theEmbed]})

                let userbots = usersdata.get(`bots_${interaction.user.id}_${interaction.guild.id}`);
                if(!userbots) {
                    await usersdata.set(`bots_${interaction.user.id}_${interaction.guild.id}` , 1)
                }else {
                    userbots = userbots + 1
                    await usersdata.set(`bots_${interaction.user.id}_${interaction.guild.id}` , userbots) 
                }
                await interaction.editReply({content:`**تم انشاء بوتك بنجاح وتم خصم \`${price1}\` من رصيدك**`})
                client25.commands = new Collection();
                client25.events = new Collection();
                require("../../Bots/roles/handlers/events")(client25)
                require("../../events/requireBots/roles-commands")(client25);
                const folderPath = path.resolve(__dirname, '../../Bots/roles/slashcommand25');
                const prefix = Bot_prefix
                client25.rolesSlashCommands = new Collection();
  const rolesSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("roles commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
      (folder) => !folder.includes(".")
      )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
          let command = require(`${folderPath}/${folder}/${file}`);
          if (command) {
              rolesSlashCommands.push(command.data.toJSON());
              client25.rolesSlashCommands.set(command.data.name, command);
              if (command.data.name) {
                  table.addRow(`/${command.data.name}`, "🟢 Working");
                } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
    }
}

const folderPath3 = path.resolve(__dirname, '../../Bots/roles/handlers');
for (let file of readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(folderPath3, file))(client25);
}
client25.on('ready' , async() => {
    setInterval(async() => {
      let BroadcastTokenss = tokens.get(`roles`)
      let thiss = BroadcastTokenss.find(br => br.token == Bot_token)
      if(thiss) {
        if(thiss.timeleft <= 0) {
            console.log(`${client25.user.id} Ended`)
          await client25.destroy();
        }
      }
    }, 1000);
  })
client25.on("ready" , async() => {
    
    try {
        await rest.put(
            Routes.applicationCommands(client25.user.id),
            { body: rolesSlashCommands },
            );
            
        } catch (error) {
            console.error(error)
        }
        
    });
    const folderPath2 = path.resolve(__dirname, '../../Bots/roles/events');
    
    for (let file of readdirSync(folderPath2).filter(f => f.endsWith('.js'))) {
        const event = require(path.join(folderPath2, file));
    }
    client25.on("interactionCreate" , async(interaction) => {
        if (interaction.isChatInputCommand()) {
            if(interaction.user.bot) return;
            
            const command = client25.rolesSlashCommands.get(interaction.commandName);
            
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
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
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        }
    } )
    
    
    client25.on("messageCreate" , async(message) => {
        if(message.content == `${prefix}buy-role`) {
          if(!message.channel.name.startsWith(`ticket`)) return message.reply({content:`**الامر يعمل في التكت فقط**`})
          let recipient = await rolesDB.get(`recipient_${message.guild.id}`)
          let probot = await rolesDB.get(`probot_${message.guild.id}`)
         if(!recipient || !probot) return message.reply({content:`**لم يتم تحديد الاعدادت من قبل الاونر لكي يتم شراء رتبة**`})
         let roles = await rolesDB.get(`roles_${message.guild.id}`)
         if(!roles) {
             await rolesDB.set(`roles_${message.guild.id}` , [])
         }
          roles = await rolesDB.get(`roles_${message.guild.id}`)
          if(roles.length <= 0) return message.reply({content:`**لا يوجد رتب متوفرة للبيع**`})
          let embed1 = new EmbedBuilder()
      .setTitle(`**الرجاء تحديد الرتبة التي تود شرائها**`)
      .setTimestamp()
      let row = new ActionRowBuilder()
      const select = new StringSelectMenuBuilder()
      .setCustomId('roles_select')
      .setPlaceholder('حدد الرتبة التي تود شرائها')
      roles.forEach(async(role) => {
          select.addOptions(
              new StringSelectMenuOptionBuilder()
                  .setLabel(`${role.roleName}`)
                  .setDescription(`سعر الرتبة : ${role.price}`)
                  .setValue(`${role.roleName}`),
          )
          
      })
      row.addComponents(select)
      return message.reply({content:`${message.author}`,embeds:[embed1], components:[row]})
        }
      })
      
      
        client25.on("interactionCreate" , async(interaction) => {
          if(interaction.isStringSelectMenu()) {
            if(interaction.customId == "roles_select") {
              let roles = await rolesDB.get(`roles_${interaction.guild.id}`)
              let selected = interaction.values[0]
              if(selected == "endBuy") {
                await interaction.reply({content:`**تم الغاء عملية الشراء وسيتم غلق التكت في خلال 10 ثواني**`})
                await interaction.message.delete();
                setTimeout(() => {
                    interaction.channel.delete();
                }, 10 * 1000);
              }
              else if(selected == "anotherBuy") {
                let embed1 = new EmbedBuilder()
                .setTitle(`**الرجاء تحديد الرتبة التي تود شرائها**`)
                .setTimestamp()
                let row = new ActionRowBuilder()
                const select = new StringSelectMenuBuilder()
                .setCustomId('roles_select')
                .setPlaceholder('حدد الرتبة التي تود شرائها')
                roles.forEach(async(role) => {
                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`${role.roleName}`)
                            .setDescription(`سعر الرتبة : ${role.price}`)
                            .setValue(`${role.roleName}`),
                    )
                    
                })
                row.addComponents(select)
                await interaction.message.edit({embeds:[embed1], components:[row]})
                await interaction.update().catch(async() => {return;})
      
              }else {
                let roleFind = await roles.find(ro => ro.roleName == selected)
                let {price , roleName , roleId} = roleFind;
                if(interaction.member.roles.cache.has(roleId)){
                  await interaction.reply({content : `**انت تمتلك هذه الرتبة <@&${roleId}> بالفعل**`})
                  await interaction.message.delete();
                }else{
                let tax = Math.floor(parseInt(price) * (20 / 19) + 1)
                let recipient = await rolesDB.get(`recipient_${interaction.guild.id}`)
                let probot = await rolesDB.get(`probot_${interaction.guild.id}`)
                let embed1 = new EmbedBuilder()
                .setTitle(`**الرجاء التحويل لاكمال عملية الشراء**`)
                .setDescription(`**الرجاء التحويل الى <@${recipient}> لأكمال عملية الشراء\`\`\`#credit ${recipient} ${tax}\`\`\`لديك 3 دقائق لأكمال عملية الشراء**`)
                .setTimestamp()
                const select = new StringSelectMenuBuilder()
                .setCustomId('roles_select')
                .setPlaceholder('خيارات أضافية')
                select.addOptions(
                  new StringSelectMenuOptionBuilder()
                  .setLabel(`الألغاء`)
                  .setDescription(`الغاء عملية الشراء وغلق التكت`)
                  .setValue(`endBuy`),
                  )
                  let row = new ActionRowBuilder().addComponents(select)
                await interaction.message.edit({embeds:[embed1] , components:[row]})
                await interaction.update().catch(async() => {return;})
      
                const collectorFilter = m => (m.content.includes(price) && m.content.includes(price) && (m.content.includes(recipient) || m.content.includes(`<@${recipient}>`)) && m.author.id == probot)
                 const collector = await interaction.channel.createMessageCollector({
                  filter:collectorFilter,
                  max: 1,
                  time: 1000 * 60 * 3
              });
              collector.on("collect" , async() => {
                let theRoleFind = interaction.guild.roles.cache.find(ro => ro.id == roleId)
                await interaction.member.roles.add(theRoleFind)
                let embed1 = new EmbedBuilder()
                .setTitle(`**تم الشراء بنجاح**`)
                .setDescription(`**تمت عملية الشراء بنجاح وتم اعطائك الرتبة , يمكنك شراء رتبة اخرى او غلق التكت من الخيارات الاضافية**`)
                .setTimestamp()
                const select = new StringSelectMenuBuilder()
                .setCustomId('roles_select')
                .setPlaceholder('خيارات أضافية')
                select.addOptions(
                  new StringSelectMenuOptionBuilder()
                  .setLabel(`شراء رتبة اخرى`)
                  .setDescription(`شراء رتبة اضافية مع الرتبة التي تم شرائها`)
                  .setValue(`anotherBuy`),
                  new StringSelectMenuOptionBuilder()
                  .setLabel(`الانهاء`)
                  .setDescription(`غلق التكت`)
                  .setValue(`endBuy`),
                  )
                  let row1 = new ActionRowBuilder().addComponents(select)
                  await interaction.message.edit({embeds:[embed1] , components:[row1]})
                  await interaction.update().catch(async() => {return;})
              })
                } 
      
              }
            }
      
          }
        })
      
      
      
        client25.on("interactionCreate" , async(interaction) => {
          if(interaction.customId === "help_general"){
            const embed = new EmbedBuilder()
                .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                .setTitle('قائمة اوامر البوت')
                .addFields(
                  {name : `\`/buy-role\` | \`${prefix}buy-role\`` , value : `لشراء رتبة بيع`},
                )
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
              {name : `\`/setup\`` , value : `لتسطيب نظام بيع الرتب`},
              {name : `\`/add-role\`` , value : `لاضافة رتبة للبيع`},
              {name : `\`/remove-role\`` , value : `لازالة رتبة من البيع`},
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

  await client25.login(Bot_token).catch(async() => {
    return interaction.editReply({content:`**فشل التحقق , الرجاء تفعيل اخر ثلاث خيارات في قائمة البوت**`})
  })
                  if(!roles) {
                      await tokens.set(`roles` , [{token:Bot_token,prefix:Bot_prefix,clientId:client25.user.id,owner:interaction.user.id,timeleft:2629744}])
                  }else {
                      await tokens.push(`roles` , {token:Bot_token,prefix:Bot_prefix,clientId:client25.user.id,owner:interaction.user.id,timeleft:2629744})
                  }
                  
                }catch(error){
                console.error(error)
                return interaction.editReply({content:`**قم بتفعيل الخيارات الثلاثة او التاكد من توكن البوت ثم اعد المحاولة**`})
            }
        }
    }
}
}