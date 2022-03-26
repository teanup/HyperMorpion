const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const { token } = require(__dirname+'/src/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
// client.buttons = new Collection();

const functions = fs.readdirSync(__dirname+'/src/functions').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(__dirname+'/src/events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync(__dirname+'/src/commands');

(async () => {
	for (file of functions) {
		require(`./src/functions/${file}`)(client);
	}
	client.handleEvents(eventFiles, __dirname+'/src/events');
	client.handleCommands(commandFolders, __dirname+'/src/commands');
	// client.handleButtons();
	client.login(token);
})();