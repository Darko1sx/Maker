const { ChatInputCommandInteraction , Client ,SlashCommandBuilder, EmbedBuilder ,StringSelectMenuBuilder,StringSelectMenuOptionBuilder, PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting")
const statuses = new Database("/database/settingsdata/statuses")
const prices = new Database("/database/settingsdata/prices.json")
const tokens = new Database("tokens/tokens")
const botStatusDB = new Database("Json-db/Others/botStatus")
const process = require('process'); 

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('تسطيب النظام')
    .addUserOption(Option => Option
                    .setName(`recipient`)
                    .setDescription(`مستلم الارباح`)
                    .setRequired(false))
    .addChannelOption(Option => Option
                    .setName(`logroom`)
                    .setDescription(`روم لوج شراء البوتات`)
                    .setRequired(false))
    .addChannelOption(Option => Option
                    .setName(`buybotroom`)
                    .setDescription(`روم بانل شراء البوتات`)
                    .setRequired(false))
    .addChannelOption(Option => Option
                    .setName(`subscriberoom`)
                    .setDescription(`روم بانل شراءاشتراك ميكر`)
                    .setRequired(false))
    .addChannelOption(Option => Option
                    .setName(`dashboardroom`)
                    .setDescription(`روم داشبورد للميكر`)
                    .setRequired(false))
    .addChannelOption(Option => Option
                    .setName(`statusroom`)
                    .setDescription(`روم الحالة للبوتات`)
                    .setRequired(false))
    .addRoleOption(Option => Option
                    .setName(`clientrole`)
                    .setDescription(`رول العملاء`)
                    .setRequired(false))
    .addUserOption(Option => Option
                    .setName(`probot`)
                    .setDescription(`البروبوت`)
                    .setRequired(false))
    .addAttachmentOption(Option => Option
                    .setName(`line`)
                    .setDescription(`الخط`)
                    .setRequired(false))
        , // or false
            /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
async execute(interaction , client) {
    await interaction.deferReply({ephemeral:true})
   let recipient = interaction.options.getUser(`recipient`)
   let logroom = interaction.options.getChannel(`logroom`)
   let subscriberoom = interaction.options.getChannel(`subscriberoom`)
   let statusroom = interaction.options.getChannel(`statusroom`)
   let buybotroom = interaction.options.getChannel(`buybotroom`)
   let dashboardroom = interaction.options.getChannel(`dashboardroom`)
   let clientrole = interaction.options.getRole(`clientrole`)
   let probot = interaction.options.getUser(`probot`)
   let line = interaction.options.getAttachment(`line`)
   if(recipient) {
   await setting.set(`recipient_${interaction.guild.id}` , recipient.id)
   }
   if(logroom) {
    await setting.set(`log_room_${interaction.guild.id}` , logroom.id)
   }
   if(clientrole) {
    await setting.set(`client_role_${interaction.guild.id}` , clientrole.id)
   }
   if(probot) {
    await setting.set(`probot_${interaction.guild.id}` , probot.id)
}
if(buybotroom) {
    await setting.set(`buy_bot_room${interaction.guild.id}` , buybotroom.id)
   }
   if(subscriberoom) {
      await setting.set(`subscribe_room_${interaction.guild.id}` , subscriberoom.id)
   }
   if(dashboardroom) {
     await setting.set(`dashboard_room_${interaction.guild.id}` , dashboardroom.id)
   }
   if(line) {
    await setting.set(`line_${interaction.guild.id}` , line.url)
   }
   if(statusroom) {
    if(setting.has(`statusroom_${interaction.guild.id}`)) {
        let messageInfo = setting.get(`statusmessageinfo_${interaction.guild.id}`)
        let {channelid , messageid} = messageInfo;
        const theChannel = interaction.guild.channels.cache.find(ch => ch.id == channelid)
        await theChannel.messages.fetch(messageid).catch(async() => {
 await setting.set(`statusroom_${interaction.guild.id}` , statusroom.id);
    const embed1 = new EmbedBuilder().setTitle(`**الحالة العامة للبوتات**`)
    const embed2 = new EmbedBuilder()
    const theBots = [
        {
            name:`التقديم` , defaultPrice:40,tradeName:`apply`
        },
        {
            name:`الاذكار`,defaultPrice:40,tradeName:`azkar`
        },
        {
            name:`القرأن`,defaultPrice:40,tradeName:`quran`
        },
        {
            name:`الخط التلقائي` , defaultPrice:40,tradeName:`autoline`
        },
        {
            name:`البلاك ليست` , defaultPrice:40,tradeName:`blacklist`
        },
        {
            name:`الطلبات`,defaultPrice:40,tradeName:`orders`
        },
        {
            name:`رومات الشوب`,defaultPrice:40,tradeName:`shopRooms`
        },
        {
            name:`التحكم في البرودكاست` , defaultPrice:100,tradeName:`Bc`
        },
        {
            name:`البرودكاست العادي` , defaultPrice:40,tradeName:`Broadcast2`
        },
        {
          name:`الرومات الخاصة` , defaultPrice:70,tradeName:`privateRooms`  
        },
        {
            name:`الكريدت الوهمي` , defaultPrice:40,tradeName:`credit`
        },
        {
            name:`الاراء` , defaultPrice:40,tradeName:`feedback`
        },
        {
            name:`الجيف اواي` , defaultPrice:40,tradeName:`giveaway`
        },
        {
            name:`اللوج` , defaultPrice:40,tradeName:`logs`
        },
        {
            name:`الناديكو` , defaultPrice:40,tradeName:`nadeko`
        },
        {
            name:`البروبوت بريميوم الوهمي` , defaultPrice:40,tradeName:`probot`
        },
        {
            name:`الحماية` , defaultPrice:40 , tradeName:`protect`
        },
        {
            name:`شراء الرتب` , defaultPrice:70 , tradeName:`roles`
        },
        {
            name:`النصابين` , defaultPrice:40,tradeName:`scam`
        },
        {
            name:`الاقتراحات` , defaultPrice:40,tradeName:`suggestions`
        },
        {
            name:`السيستم` , defaultPrice:100 , tradeName:`system`
        },
        {
            name:`الضريبة` , defaultPrice:40,tradeName:`tax`
        },
        {
            name:`التكت` , defaultPrice:160,tradeName:`ticket`
        },
        {
            name:`الشوب` , defaultPrice:70,tradeName:`shop`
        },
        {
            name : `واحد للكل` , defaultPrice:200,tradeName:`one4all`
        }
    ]
    theBots.forEach(async(theBot) => {
        let theBotTokens = tokens.get(theBot.tradeName)
        let theBotStats = statuses.get(theBot.tradeName) ?? true
        embed1.addFields(
            {
                name:`**بوتات ${theBot.name} ${botStatusDB.get(theBot.tradeName) === "off" ? "🔴" : "🟢"}**` , value:`**السعر في السيرفر : \`${prices.get(theBot.tradeName+`_price_`+interaction.guild.id) ?? theBot.defaultPrice}\` عملة**\nعدد البوتات العامة : \`${theBotTokens.length ?? 0}\`` , inline:false
            }
        )
    })
    const totalSeconds = process.uptime();
	const days = Math.floor(totalSeconds / (3600 * 24)); 
	const remainingSecondsAfterDays = totalSeconds % (3600 * 24);
	const hours = Math.floor(remainingSecondsAfterDays / 3600);
	const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
	const minutes = Math.floor(remainingSecondsAfterHours / 60);
	const seconds = Math.floor(remainingSecondsAfterHours % 60);
    embed2.addFields(
        {
            name:`**تم الرفع لمدة :**` , inline:false,value:`**\`${days}\` Days,\`${hours}\` Hours , \`${minutes}\` Minutes , \`${seconds}\` Seconds  بدون انقطاع**`
        }
    )
    embed1.setColor('Random')
	embed1.setThumbnail(interaction.guild.iconURL({dynamic:true}))
    embed1.setFooter({text:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})

    embed2.setColor('Random')
	embed2.setThumbnail(interaction.guild.iconURL({dynamic:true}))
    embed2.setFooter({text:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})

    const theMsg = await statusroom.send({embeds:[embed1 , embed2]});
    await setting.set(`statusmessageinfo_${interaction.guild.id}` , {messageid:theMsg.id,channelid:theMsg.channel.id});
        })
        const theMessages = await theChannel.messages.cache.find(ms => ms.id == messageid)
        await theMessages.delete();
    }
    await setting.set(`statusroom_${interaction.guild.id}` , statusroom.id);
    const embed1 = new EmbedBuilder().setTitle(`**الحالة العامة للبوتات**`)
    const embed2 = new EmbedBuilder()
    const theBots = [
        {
            name:`التقديم` , defaultPrice:15,tradeName:`apply`
        },
        {
            name:`الاذكار`,defaultPrice:1,tradeName:`azkar`
        },
        {
            name:`القرأن`,defaultPrice:1,tradeName:`quran`
        },
        {
            name:`الخط التلقائي` , defaultPrice:15,tradeName:`autoline`
        },
        {
            name:`البلاك ليست` , defaultPrice:15,tradeName:`blacklist`
        },
        {
            name:`الطلبات`,defaultPrice:20,tradeName:`orders`
        },
        {
			name:`رومات الشوب`,defaultPrice:20,tradeName:`shopRooms`
		},
        {
            name:`التحكم في البرودكاست` , defaultPrice:40,tradeName:`Bc`
        },
		{
			name:`البرودكاست العادي` , defaultPrice:20,tradeName:`Broadcast2`
		},
        {
          name:`الرومات الخاصة` , defaultPrice:20,tradeName:`privateRooms`  
        },
        {
            name:`الكريدت الوهمي` , defaultPrice:15,tradeName:`credit`
        },
        {
            name:`الاراء` , defaultPrice:15,tradeName:`feedback`
        },
        {
            name:`الجيف اواي` , defaultPrice:15,tradeName:`giveaway`
        },
        {
            name:`اللوج` , defaultPrice:15,tradeName:`logs`
        },
        {
            name:`الناديكو` , defaultPrice:15,tradeName:`nadeko`
        },
        {
            name:`البروبوت بريميوم الوهمي` , defaultPrice:15,tradeName:`probot`
        },
		{
			name:`الحماية` , defaultPrice:20 , tradeName:`protect`
		},
        {
			name:`شراء الرتب` , defaultPrice:25 , tradeName:`roles`
		},
        {
            name:`النصابين` , defaultPrice:15,tradeName:`scam`
        },
        {
            name:`الاقتراحات` , defaultPrice:15,tradeName:`suggestions`
        },
		{
			name:`السيستم` , defaultPrice:35 , tradeName:`system`
		},
        {
            name:`الضريبة` , defaultPrice:15,tradeName:`tax`
        },
        {
            name:`التكت` , defaultPrice:40,tradeName:`ticket`
        },
		{
			name:`الشوب` , defaultPrice:40,tradeName:`shop`
		},
        {
            name : `واحد للكل` , defaultPrice:200,tradeName:`one4all`
        }
    ]
    theBots.forEach(async(theBot) => {
        let theBotTokens = tokens.get(theBot.tradeName)
        let theBotStats = statuses.get(theBot.tradeName) ?? true
        embed1.addFields(
            {
                name:`**بوتات ${theBot.name} ${botStatusDB.get(theBot.tradeName) === "off" ? "🔴" : "🟢"}**` , value:`**السعر في السيرفر : \`${prices.get(theBot.tradeName+`_price_`+interaction.guild.id) ?? theBot.defaultPrice}\` عملة**\nعدد البوتات العامة : \`${theBotTokens.length ?? 0}\`` , inline:false
            }
        )
    })
    const totalSeconds = process.uptime();
	const days = Math.floor(totalSeconds / (3600 * 24)); 
	const remainingSecondsAfterDays = totalSeconds % (3600 * 24);
	const hours = Math.floor(remainingSecondsAfterDays / 3600);
	const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
	const minutes = Math.floor(remainingSecondsAfterHours / 60);
	const seconds = Math.floor(remainingSecondsAfterHours % 60);
    embed2.addFields(
        {
            name:`**تم الرفع لمدة :**` , inline:false,value:`**\`${days}\` Days,\`${hours}\` Hours , \`${minutes}\` Minutes , \`${seconds}\` Seconds  بدون انقطاع**`
        }
    )
    embed1.setColor('Random')
	embed1.setThumbnail(interaction.guild.iconURL({dynamic:true}))
    embed1.setFooter({text:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})

    embed2.setColor('Random')
	embed2.setThumbnail(interaction.guild.iconURL({dynamic:true}))
    embed2.setFooter({text:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})

    const theMsg = await statusroom.send({embeds:[embed1  , embed2]});
    await setting.set(`statusmessageinfo_${interaction.guild.id}` , {messageid:theMsg.id,channelid:theMsg.channel.id});
   }
   
   if(!recipient && !line && !subscriberoom && !statusroom && !logroom && !clientrole && !probot && !buybotroom && !dashboardroom) return interaction.editReply({content:`**الرجاء تحديد اعداد واحد على الاقل**`}) 
   return interaction.editReply({content:`**تم تحديد الاعدادات بنجاح**`})
}
}