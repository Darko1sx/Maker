const { Client, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const client = new Client({intents: 131071});
client.setMaxListeners(999999);
const { readdirSync } = require("fs")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const mongodb = require('mongoose');
const { token , mainguild , database , WEBHOOK_URL } = require(`./config.json`)
const ascii = require('ascii-table');
const { Database } = require("st.db");
const buyerCheckerDB = new Database('/Json-db/Others/buyerChecker.json')
const { owner , prefix} = require('./config.json');
const archiver  = require('archiver');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

client.login(token).catch(err => console.log('❌ Token are not working'));
client.commandaliases = new Collection()
const rest = new REST({ version: '10' }).setToken(token);
client.setMaxListeners(1000)
module.exports = client;
exports.mainBot = client;
client.on("ready", async () => {
	try {
		//  تسجيل اوامر السلاش كوماند
		await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: slashcommands },
		);

		await rest.put(
            Routes.applicationGuildCommands(client.user.id, mainguild),
            { body: guildSlashCommands },
        );

	} catch (error) {
		console.error(error);
	}
	// الاتصال بالمونجو
	await mongodb.connect(database , {
	}).then(async()=> {
		console.log('🟢 Connected To Database Successfully 🟢')
	}).catch(()=> {
		console.log(`🔴 Failed Connect To Database 🔴`)
	});

	// حذف حميع المعلومات في ملف التحقق من عمليات الشراء
	buyerCheckerDB.deleteAll();

    console.log(`Done set everything`);
	
})
client.slashcommands = new Collection()
const slashcommands = [];
const guildSlashCommands = [];
const table = new ascii('Owner Commands').setJustify();
for (let folder of readdirSync('./ownerOnly/').filter(folder => !folder.includes('.') && folder !== 'Developers')) {
  for (let file of readdirSync('./ownerOnly/' + folder).filter(f => f.endsWith('.js'))) {
	  let command = require(`./ownerOnly/${folder}/${file}`);
	  if(command) {
		  slashcommands.push(command.data.toJSON());
          client.slashcommands.set(command.data.name, command);
		  if(command.data.name) {
			  table.addRow(`/${command.data.name}` , '🟢 Working')
		  }
		  if(!command.data.name) {
			  table.addRow(`/${command.data.name}` , '🔴 Not Working')
		  }
	  }
  }
}

// Load guild-specific slash commands
for (let file of readdirSync('./ownerOnly/Developers').filter(f => f.endsWith('.js'))) {
    let command = require(`./ownerOnly/Developers/${file}`);
    if (command) {
        guildSlashCommands.push(command.data.toJSON());
        client.slashcommands.set(command.data.name, command);
        table.addRow(`/${command.data.name}`, '🟢 Working for mainguild');
    }
}

console.log(table.toString())

for (let folder of readdirSync('./events/').filter(folder => !folder.includes('.'))) {
	for (let file of readdirSync('./events/' + folder).filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${folder}/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	}
  }
  for (let folder of readdirSync('./buttons/').filter(folder => !folder.includes('.'))) {
	for (let file of readdirSync('./buttons/' + folder).filter(f => f.endsWith('.js'))) {
		const event = require(`./buttons/${folder}/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	}
  }
  //
  for(let file of readdirSync('./database/').filter(file => file.endsWith('.js'))) {
	const reuirenation = require(`./database/${file}`)
  }

// Your webhook URL
// Folders to backup
const FOLDERS_TO_BACKUP = ['Json-db', 'database' , 'tokens'];
// Path to save the zip file
const BACKUP_PATH = path.join(__dirname, 'backup.zip');

client.on("messageCreate" , async(message) => {
	if(message.content == "backup"){
	// Function to create a zip archive
	const createBackup = () => {
		const output = fs.createWriteStream(BACKUP_PATH);
		const archive = archiver('zip', { zlib: { level: 9 } });
	
		output.on('close', () => {
		  console.log(`Backup created: ${archive.pointer()} total bytes`);
	
		  // Send the backup to the webhook
		  sendBackupToWebhook();
		});
	
		archive.on('error', (err) => {
		  throw err;
		});
	
		archive.pipe(output);
	
		FOLDERS_TO_BACKUP.forEach((folder) => {
		  const folderPath = path.join(__dirname, folder);
		  if (fs.existsSync(folderPath)) {
			archive.directory(folderPath, folder);
		  } else {
			console.error(`Folder not found: ${folderPath}`);
		  }
		});
	
		archive.finalize();
	  };
	
	  // Function to send the backup file to the Discord webhook
	  const sendBackupToWebhook = async () => {
		const form = new FormData();
		form.append('file', fs.createReadStream(BACKUP_PATH));
	
		try {
		  const response = await axios.post(WEBHOOK_URL, form, {
			headers: {
			  ...form.getHeaders(),
			},
		  });
		  if (response.status === 200) {
			console.log('Backup sent successfully');
		  } else {
			console.error('Error sending backup:', response.statusText);
		  }
		} catch (error) {
		  console.error('Error sending backup:', error);
		}
	  };
	
	  // Create the backup when the bot is ready
	  createBackup();

	  await message.react('✅');
	}
})

setInterval(async() => {
		// Function to create a zip archive
		const createBackup = () => {
			const output = fs.createWriteStream(BACKUP_PATH);
			const archive = archiver('zip', { zlib: { level: 9 } });
		
			output.on('close', () => {
			  console.log(`Backup created: ${archive.pointer()} total bytes`);
		
			  // Send the backup to the webhook
			  sendBackupToWebhook();
			});
		
			archive.on('error', (err) => {
			  throw err;
			});
		
			archive.pipe(output);
		
			FOLDERS_TO_BACKUP.forEach((folder) => {
			  const folderPath = path.join(__dirname, folder);
			  if (fs.existsSync(folderPath)) {
				archive.directory(folderPath, folder);
			  } else {
				console.error(`Folder not found: ${folderPath}`);
			  }
			});
		
			archive.finalize();
		  };
		
		  // Function to send the backup file to the Discord webhook
		  const sendBackupToWebhook = async () => {
			const form = new FormData();
			form.append('file', fs.createReadStream(BACKUP_PATH));
		
			try {
			  const response = await axios.post(WEBHOOK_URL, form, {
				headers: {
				  ...form.getHeaders(),
				},
			  });
			  if (response.status === 200) {
				console.log('Backup sent successfully');
			  } else {
				console.error('Error sending backup:', response.statusText);
			  }
			} catch (error) {
			  console.error('Error sending backup:', error);
			}
		  };
		
		  // Create the backup when the bot is ready
		  createBackup();
}, 600_000);

process.on('uncaughtException', (err) => {
  console.log(err)
});
process.on('unhandledRejection', (reason, promise) => {
 console.log(reason)
});
 process.on("uncaughtExceptionMonitor", (reason) => { 
	console.log(reason)
});