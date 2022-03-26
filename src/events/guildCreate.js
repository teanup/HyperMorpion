const { editGuildLang } = require('../languages/edit-lang')

module.exports = {
	name: 'guildCreate',
	async execute(guild, client) {
		await editGuildLang(guild.id, 0);
		console.log(`Joined the server "${guild.name}" with ID: ${guild.id}.`)
	}
};