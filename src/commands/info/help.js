const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getTrsln, getAllLangList } = require('../../languages/fetch-lang')
const gamesList = require('../../games/games-list.json');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Help for using the bot'),
	async execute(interaction, client) {
		// get translated texts
		const helpTexts = await getTrsln(interaction.guild.id, 'help');

		// get all languages
		let allLangs = `  **${getAllLangList[0]}**`;
		getAllLangList.slice(1).forEach(langName => allLangs += `,  **${langName}**`);

		// get all games
		let allGames = `  **${gamesList[0].label}**`;
		gamesList.slice(1).forEach(game => allGames += `,  **${game.label}**`);

		// send help panel
		const helpEmbed = new MessageEmbed()
			.setColor(helpTexts.color)
			.setTitle(helpTexts.title)
			.setDescription(helpTexts.description)
			.addFields(
				{ name: helpTexts.info.name, value: helpTexts.info.value },
				{ name: helpTexts.language.name, value: helpTexts.language.value + allLangs },
				{ name: helpTexts.ping.name, value: helpTexts.ping.value },
				{ name: helpTexts.rules.name, value: helpTexts.rules.value + allGames },
				{ name: helpTexts.hypermorpion.name, value: helpTexts.hypermorpion.value },
				{ name: helpTexts.tictactoe.name, value: helpTexts.tictactoe.value }
			);

		await interaction.reply({
			embeds: [helpEmbed]
		});
	},
};
