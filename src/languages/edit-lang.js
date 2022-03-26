const fs = require('fs');
const guildsLang = require('./guilds-lang.json');

module.exports = {
	async editGuildLang(guildId, langId) {
		guildsLang[String(guildId)] = await langId;
		fs.writeFileSync(__dirname + '/guilds-lang.json', JSON.stringify(guildsLang));
	}
};