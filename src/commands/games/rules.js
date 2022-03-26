const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getTrsln } = require('../../languages/fetch-lang');
const gamesList = require('../../games/games-list.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Read the games\' rules'),
	async execute(interaction, client) {
		// get translated texts
		const rulesTexts = await getTrsln(interaction.guild.id, 'rules');

		// make selection embed
		const rulesEmbed = new MessageEmbed()
			.setColor(rulesTexts.color)
			.setTitle(rulesTexts.title)
			.setDescription(rulesTexts.description)

		// game selection menu
		const gameSelectRow = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('gameSelect')
					.setPlaceholder(rulesTexts.select)
					.addOptions(gamesList)
					.setMaxValues(1)
			);

		// game selection request message
		await interaction.reply({
			embeds: [rulesEmbed],
			components: [gameSelectRow]
		});
		const rulesMsg = await interaction.fetchReply();

		// wait for reply
		const filter = rulesInter => rulesInter.user.id === interaction.user.id;
		await rulesMsg.awaitMessageComponent({ filter, time: rulesTexts.delay*1000 })
		.then(async rulesInter => {
			const gameId = await rulesInter.values.at(0);
			// get translated texts
			const gameRulesTexts = await getTrsln(interaction.guild.id, `${gameId}Rules`);

			// edit rule message
			rulesEmbed
				.setColor(gameRulesTexts.color)
				.setTitle(gameRulesTexts.title)
				.setDescription(gameRulesTexts.description)
				.setFields(gameRulesTexts.fields);
			await interaction.editReply({
				embeds: [rulesEmbed],
				components: []
			});
		})
		.catch(async () => {
			await rulesMsg.delete();
			await interaction.followUp({
				content: await getTrsln(interaction.guild.id, 'timeout'),
				ephemeral: true
			});
		});
	},
};