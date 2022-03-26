const guildsLang = require('./guilds-lang.json');
const translations = require('./translations.json');

module.exports = {
	async getGuildLang(guildId) { return guildsLang[guildId] },
	async getText(langId, textId) { return translations[textId][langId] },
	async getTrsln(guildId, textId) { return translations[textId][guildsLang[guildId]]},
	getAllLangList: translations['lang_name']
};