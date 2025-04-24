const { Database } = require('st.db')
const botStatusDB = new Database("Json-db/Others/botStatus")
const tokens = new Database("tokens/tokens")
const { readdirSync } = require("fs")
const path = require('path');

// ------------- حالة البوتات العادية -------------------//
// ------------------------------------------------//
var AsciiTable = require('ascii-table')
const tablee = new AsciiTable('Normal Bots')
tablee.setHeading('' , 'Type' , 'Length' ,'Status')

checkStatus(`ticket` , '../../Bots/ticket/ticket-Bots' , 10_000)
checkStatus(`Bc` , '../../Bots/Broadcast/Broadcast-Bots' , 10_000)
checkStatus(`Broadcast2` , '../../Bots/NormalBroadcast/Broadcast-Bots' , 10_000)
checkStatus(`apply` , '../../Bots/apply/apply-Bots' , 10_000)
checkStatus(`autoline` , '../../Bots/autoline/autoline-Bots' , 10_000)
checkStatus(`azkar` , '../../Bots/azkar/azkar-Bots' , 10_000)
checkStatus(`blacklist` , '../../Bots/blacklist/blacklist-Bots' , 10_000)
checkStatus(`credit` , '../../Bots/credit/credit-Bots' , 10_000)
checkStatus(`feedback` , '../../Bots/feedback/feedback-Bots' , 10_000)
checkStatus(`giveaway` , '../../Bots/giveaway/giveaway-Bots' , 10_000)
checkStatus(`logs` , '../../Bots/logs/logs-Bots' , 10_000)
checkStatus(`nadeko` , '../../Bots/nadeko/nadeko-Bots' , 10_000)
checkStatus(`one4all` , '../../Bots/one4all/One4all-Bots' , 10_000)
checkStatus(`orders` , '../../Bots/orders/orders-Bots' , 10_000)
checkStatus(`privateRooms` , '../../Bots/privateRooms/privateRooms-Bots' , 10_000)
checkStatus(`probot` , '../../Bots/probot/probot-Bots' , 10_000)
checkStatus(`protect` , '../../Bots/protect/protect-Bots' , 10_000)
checkStatus(`quran` , '../../Bots/quran/quran-Bots' , 10_000)
checkStatus(`roles` , '../../Bots/roles/roles-Bots' , 10_000)
checkStatus(`shop` , '../../Bots/shop/Shop-Bots' , 10_000)
checkStatus(`scam` , '../../Bots/scammers/Scammers-Bots' , 10_000)
checkStatus(`shopRooms` , '../../Bots/shopRooms/shopRooms-Bots' , 10_000)
checkStatus(`suggestions` , '../../Bots/suggestions/suggestions-Bots' , 10_000)
checkStatus(`system` , '../../Bots/system/system-Bots' , 10_000)
checkStatus(`tax` , '../../Bots/tax/Tax-Bots' , 10_000)

function checkStatus(type , filePath , interval) {
	let theInterval = interval || 5_000
	setInterval(() => {
		const sta = botStatusDB.get(type);
		if(sta === "off"){
		}else{
			require(filePath)
		}
	}, theInterval);
}

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

theBots.forEach(async(bot , index) => {
    let theBotTokens = await tokens.get(bot.tradeName) || []

    tablee.addRow(index + 1, bot.tradeName , `${theBotTokens.length ?? 0}`, `${botStatusDB.get(bot.tradeName)  === "off" ? "🔴 Not Working" : "🟢 Working"}`);
})

setTimeout(() => {
    console.log(tablee.toString());
}, 5_000);
// ------------------------------------------------//

//--------------- حالة بوتات الميكر --------------//
// ------------------------------------------------//
const ultimateBotsPath = path.resolve(__dirname, '../../ultimateBots/');

setInterval(() => {
    if(botStatusDB.get(`premuimMaker`) === "off"){

    }else{
        for (let folder of readdirSync('premiumBots/').filter(folder => !folder.includes('.'))) {
            for (let file of readdirSync('premiumBots/' + folder).filter(f => f.endsWith('.js'))) {
                const event = require(`../../premiumBots/${folder}/${file}`);
            }
          }
          for (let folder of readdirSync('premiumBots/').filter(folder => folder.endsWith('.js'))) {
                const event = require(`../../premiumBots/${file}`);
            }
    }    
}, 5_000);

setInterval(() => {
    for (let folder of readdirSync('ultimateBots/').filter(folder => !folder.includes('.'))) {
		for (let file of readdirSync('ultimateBots/' + folder).filter(f => f.endsWith('.js'))) {
			const event = require(`../../ultimateBots/${folder}/${file}`);
		}
	  }
	  for (let folder of readdirSync('ultimateBots/').filter(folder => folder.endsWith('.js'))) {
			const event = require(`../../ultimateBots/${file}`);
		}
}, 5_000);
// ------------------------------------------------//