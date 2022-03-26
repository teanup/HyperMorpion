const { status, statusType} = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client, interaction) {
		console.log(`Logged in as ${client.user.tag}`);
		client.user.setActivity(status, { type: statusType });
	}
};