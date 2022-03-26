const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getText, getTrsln, getAllLangList } = require('../../languages/fetch-lang')
const { editGuildLang } = require('../../languages/edit-lang')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('language')
		.setDescription('Change the bot\'s language for this server'),
	async execute(interaction, client) {

		// get translated texts
		const langTexts = await getTrsln(interaction.guild.id, 'language');

		// make selection embed
		const langEmbed = new MessageEmbed()
			.setColor(langTexts.color)
			.setTitle(langTexts.title)
			.setDescription(langTexts.description)

		// language options array
		const langSelectArray = [];
		for (let langId = 0; langId < getAllLangList.length; langId++) {
			let langName = getAllLangList[langId];
			langSelectArray.push({
				label: langName,
				description: await getText(langId, 'languageDescriptions'),
				value: String(langId)
			});
		};

		// language selection menu
		const langSelectRow = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('lang-select')
					.setPlaceholder(langTexts.select)
					.addOptions(langSelectArray)
					.setMaxValues(1)
			);
	
		// language selection request message
		await interaction.reply({
			embeds: [langEmbed],
			components: [langSelectRow]
		});
		const langMsg = await interaction.fetchReply();

		// wait for reply
		const filter = langInter => langInter.user.id === interaction.user.id;
		await langMsg.awaitMessageComponent({ filter, time: langTexts.delay*1000 })
		.then(async langInter => {
			const newLang = +langInter.values.at(0);
			// change language
			await editGuildLang(langInter.guild.id, newLang);

			// get translated text
			const changedText = await getText(newLang, 'languageChanged');

			// announce language change
			langEmbed
				.setColor(langTexts.color)
				.setTitle(changedText)
				.setDescription('');
			await interaction.editReply({
				embeds: [langEmbed],
				components: []
			});	
		})
		.catch(async () => {
			await langMsg.delete();
			await interaction.followUp({
				content:  await getTrsln(interaction.guild.id, 'timeout'),
				ephemeral: true
			});
		});
	}
};