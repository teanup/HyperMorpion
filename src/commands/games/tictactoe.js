const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getTrsln } = require('../../languages/fetch-lang');
const { startTttGame } = require('../../games/tictactoe/start-ttt-game');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tictactoe')
 		.setDescription('Start a game of Tic-tac-toe with a friend')
		.addUserOption(option => 
			option.setName('member')
				.setDescription('Select who you want to play with')
				.setRequired(true)),
	async execute(interaction, client) {

		// get translated texts and concerned players
		const guildId = interaction.guild.id
		const gameInvTexts = await getTrsln(guildId, 'gameInvite');
		const tttInvTexts = await getTrsln(guildId, 'tttInvite');
		const player1Id = interaction.user.id;
		const player2Id = interaction.options.getUser('member', true).id;

		// make invite embed
		const tttInvEmbed = new MessageEmbed()
			.setColor(tttInvTexts.color)
			.setTitle(tttInvTexts.title)
			.setDescription(`${tttInvTexts.description[0]}<@${player2Id}>${tttInvTexts.description[1]}<@${player1Id}>${tttInvTexts.description[2]}`);

		// invite request buttons
		const invRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('ttt-inv-accept')
					.setLabel(gameInvTexts.accept)
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('ttt-inv-decline')
					.setLabel(gameInvTexts.decline)
					.setStyle('DANGER')
				);

		// invite message
		await interaction.reply({
			embeds: [tttInvEmbed],
			components: [invRow]
		});
		const invMsg = await interaction.fetchReply();

		// wait for reply
		const filter = invInter => invInter.user.id === player2Id;
		await invMsg.awaitMessageComponent({ filter, time: gameInvTexts.delay*1000 })
		.then(async invInter => {
			await invInter.deferUpdate();
			const answer = invInter.customId;

			if (answer == 'ttt-inv-decline') {
				// edit invite message
				tttInvEmbed.setDescription(gameInvTexts.refused);
				await interaction.editReply({
					embeds: [tttInvEmbed],
					components: []
				});
			} else {
				// start a game
				await startTttGame(player1Id, player2Id, interaction);
			}
		})
		.catch(async () => {
			// edit invite message
			tttInvEmbed.setDescription(`<@${player2Id}>${gameInvTexts.timeout}`);
			await interaction.editReply({
				embeds: [tttInvEmbed],
				components: []
			});
		});
	}
};