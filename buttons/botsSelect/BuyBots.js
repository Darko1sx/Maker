const {Events ,  EmbedBuilder , ActionRowBuilder , ButtonBuilder , ButtonStyle , Interaction ,ModalBuilder , TextInputBuilder , TextInputStyle , StringSelectMenuOptionBuilder , StringSelectMenuBuilder} = require("discord.js")
const { mainguild } = require('../../config.json');
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const statuses = new Database("/database/settingsdata/statuses")
const tokenDB = new Database("/Json-db/Others/TokensDB.json")
const buyStatusDB = new Database("Json-db/Others/buyStatus")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")

module.exports = {
    name : Events.InteractionCreate,
    /**
        * @param {Interaction} interaction
    */
   async execute(interaction){
        if(interaction.customId === "select_buy"){
            const theBotMember = interaction.guild.members.cache.get(interaction.client.user.id);
            const botRole = theBotMember.displayHexColor || "Random";

            if(interaction.values[0] === "selectBuyBot"){
                await interaction.deferReply({ephemeral : true});
                    let embed = new EmbedBuilder()
                    .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                    .setTitle(`**بانل شراء يوت**`)
                    .setColor(botRole)
                    .setThumbnail(interaction.client.user.displayAvatarURL({dynamic : true}))
                    .setDescription(`**يمكنك شراء بوت عن طريق الضغط على البوت من القائمة**`)
                    .setTimestamp()
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
                        let theBotStats = statuses.get(theBot.tradeName) ?? true
                        embed.addFields(
                            {
                                name:`**بوتات ${theBot.name} **` , value:`**السعر في السيرفر : \`${prices.get(theBot.tradeName+`_price_`+interaction.guild.id) ?? theBot.defaultPrice}\` عملة** 🪙` , inline:false
                            }
                        )
                    })
                    const select = new StringSelectMenuBuilder()
                    .setCustomId('select_bot')
                    .setPlaceholder('قم بأختيار البوت من القائمة')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)    
                            .setLabel('Apply')
                            .setDescription('شراء بوت تقديمات')
                            .setValue('BuyApply'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)    
                            .setLabel('Azkar')
                            .setDescription('شراء بوت اذكار')
                            .setValue('BuyAzkar'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)    
                            .setLabel('Quran')
                            .setDescription('شراء بوت قرأن')
                            .setValue('BuyQuran'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('AutoLine')
                            .setDescription('شراء بوت خط تلقائي')
                            .setValue('BuyAutoline'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Blacklist')
                            .setDescription('شراء بوت بلاك ليست')
                            .setValue('BuyBlacklist'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Broadcast')
                            .setDescription('شراء بوت برودكاست')
                            .setValue('BuyBroadcast'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Orders')
                            .setDescription('شراء بوت طلبات')
                            .setEmoji(`🔹`)    
                            .setValue('BuyOrders'), 
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Private Rooms')
                            .setDescription('شراء بوت رومات خاصة')
                            .setEmoji(`🔹`)    
                            .setValue('BuyPrivateRooms'),   
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)    
                            .setLabel('Normal Broadcast')
                            .setDescription('شراء بوت برودكاست عادي')
                            .setValue('BuyNormalBroadcast'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Credit')
                            .setDescription('شراء بوت كريدت وهمي')
                            .setValue('BuyCredit'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Feedback')
                            .setDescription('شراء بوت اراء')
                            .setValue('BuyFeedback'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Giveaway')
                            .setDescription('شراء بوت جيف اواي')
                            .setValue('BuyGiveaway'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Logs')
                            .setDescription('شراء بوت لوج')
                            .setValue('BuyLogs'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Nadeko')
                            .setDescription('شراء بوت ناديكو')
                            .setValue('BuyNadeko'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Probot')
                            .setDescription('شراء بوت  بروبوت بريميوم وهمي')
                            .setValue('BuyProbot'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Protect')
                            .setDescription('شراء بوت حماية')
                            .setValue('BuyProtect'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Buy Roles')
                            .setDescription('شراء بوت شراء رتب')
                            .setValue('BuyRoles'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Scammers')
                            .setDescription('شراء بوت نصابين')
                            .setValue('BuyScammers'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Suggestions')
                            .setDescription('شراء بوت اقتراحات')
                            .setValue('BuySuggestions'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('System')
                            .setDescription('شراء بوت سيستم')
                            .setValue('BuySystem'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Shop')
                            .setDescription('شراء بوت شوب')
                            .setValue('BuyShop'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Shop Rooms')
                            .setEmoji(`🔹`)
                            .setDescription('شراء بوت رومات شوب')
                            .setValue('BuyShopRooms'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Tax')
                            .setDescription('شراء بوت ضريبة')
                            .setValue('BuyTax'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔹`)
                            .setLabel('Ticket')
                            .setDescription('شراء بوت تكت')
                            .setValue('BuyTicket'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔃`)
                            .setLabel('Reset')
                            .setDescription('عمل اعادة تعيين للاختيار')
                            .setValue('Reset_Selected'),
                    );
                    const select2 = new StringSelectMenuBuilder()
                    .setCustomId('select_bot2')
                    .setPlaceholder('قم بأختيار البوت من القائمة')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`✨`)
                            .setLabel('One4All')
                            .setDescription('شراء بوت واحد للكل')
                            .setValue('BuyOne4all'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`🔃`)
                            .setLabel('Reset')
                            .setDescription('عمل اعادة تعيين للاختيار')
                            .setValue('Reset_Selected'),
                    );
                    const row = new ActionRowBuilder().addComponents(select);
                    const row2 = new ActionRowBuilder().addComponents(select2);


                    await interaction.editReply({embeds : [embed] , components : [row , row2] , ephemeral : true});

                    setTimeout(async() => {
                        try {
                            await interaction.deleteReply();
                        } catch (error) {
                            return;
                        }
                    }, 20_000);
            }else if(interaction.values[0] === "selectBuyToken"){
                // التحقق اذا ايدي السيرفر مو نفسه ايدي السيرفر الرسمي
                if(interaction.guild.id !== mainguild) {
                // البحث في اشتراكات ميكر التيميت عبر ايدي السيرفر
                const subs3 = await tier3subscriptions.get(`tier3_subs`) || [];
                const sub3 = await subs3.find(su => su.guildid == interaction.guild.id)
                // البحث في اشتراكات ميكر بريميوم عبر ايدي السيرفر
                const subs2 = await tier2subscriptions.get(`tier2_subs`) || []
                const sub2 = await subs2.find(su => su.guildid == interaction.guild.id)
                // اذا لم يكن هناك اشتراكات بريميوم او التيميت
                if(!sub3 && !sub2) {
                    // الرد بايمبد توجه للسيرفر الرسمي
                    await interaction.deferReply({ephemeral : true})
                    const invitebot = new ButtonBuilder().setLabel('السيرفر الرسمي').setURL(`https://discord.gg/tdvubCxu7Y`).setStyle(ButtonStyle.Link);
                    const row2 = new ActionRowBuilder().addComponents(invitebot);
                    return interaction.editReply({ephemeral:true,content:`**توجه الى السيرفر الرسمي**` , components:[row2] , embeds : []})
                }
                }   
                    // التحقق اذا مطورين البوت اطفوا شراء توكنات البوتات
                    if(buyStatusDB.get(`tokens`) === "off"){
                        return interaction.reply({content : `***لا تستطيع شراء هذا البوت في الوقت الحالي***\n**تستطيع ان تحاول مره ثانيه عندما يكون متوفر**` , ephemeral : true})
                    }
                    // جلب التوكنات المتوفرة للبيع
                    const theTokens = await tokenDB.get('theTokens') || [];
                    // اذا مخزون التوكنات كان غير موجود يعني 0
                    if(theTokens.length <= 0){
                        // الرد برسالة عدم وجود مخزون
                        await interaction.deferReply({ephemeral : true});
                        await interaction.editReply({content : `**لا يوجد مخزون حاليا**` , ephemeral : true})
                    }else{
                        // جلب معلومات الشراء كسعر العملة و سعر التوكن و روم اللوج و البروبوت الخ
                        let price1 = setting.get(`balance_price_${interaction.guild.id}`) ?? 1000;
                        let recipient = setting.get(`recipient_${interaction.guild.id}`)
                        let logroom =  setting.get(`log_room_${interaction.guild.id}`)
                        let probot = setting.get(`probot_${interaction.guild.id}`)
                        let clientrole = setting.get(`client_role_${interaction.guild.id}`)
                        // اذا كان اونر السيرفر لم يعمل تسطيب للميكر في السيرفر
                        if(!price1 || !recipient || !logroom || !probot || !clientrole) return interaction.editReply({content:`**لم يتم تحديد الاعدادات**` , ephemeral:true})
                        // جلب سعر التوكن
                        let TokenPrice = parseInt(prices.get(`token_price_${interaction.guild.id}`))
                       if(!TokenPrice) TokenPrice = 15;
                        // جلب رصيد العضو
                        let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
                        // اذا العضو لا يمتلك رصيد اي 0 عملة ، البوت يقوم بوضع 0 في الداتا بيس
                        if(!userbalance) {
                            await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , 0)
                        }
                        // جلب رصيد العضو
                        userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
                        // اذا عملات العضو اقل من عملات التوكن
                        if(userbalance < TokenPrice) return interaction.reply({content:`**انت لا تمتلك الرصيد الكافي\n سعر التوكن : \`${TokenPrice}\` عملة**` , ephemeral:true})
                        // تحضير مودال شراء توكن
                        const modal = new ModalBuilder()
                                            .setCustomId('BuyToken_Modal')
                                            .setTitle('Buy Bot Token');
                       const Token_amount = new TextInputBuilder()
                                            .setCustomId('Token_amount')
                                            .setLabel("اكتب تم لاكمال عملية الشراء")
                                            .setPlaceholder('تم')
                                            .setStyle(TextInputStyle.Short)
                                            .setMinLength(1)
                                            .setMaxLength(2)
                       const firstActionRow = new ActionRowBuilder().addComponents(Token_amount);
                       modal.addComponents(firstActionRow)
                       // اظهار المودال
                       await interaction.showModal(modal)
                    }
                
                }else if(interaction.values[0] === "Reset_Selected"){
                try {
                    return interaction.update().catch(async() => {return;})
                  } catch  {
                    return;
                  }
            }

            setTimeout(() => {
                interaction.message.edit({ components: [interaction.message.components[0] , interaction.message.components[1]] })
            }, 1500)
        }
   }
}