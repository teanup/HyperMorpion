const { MessageEmbed } = require('discord.js');
const { getGame } = require('./get-game');
const { selectGrid, selectSquare, announceWinner } = require('./game-interactions');

module.exports = {
	async startHmGame(player1Id, player2Id, interaction) {
		// initialize game
		const game = await getGame(player1Id, player2Id,
			await interaction.fetchReply());
		await game.storeCurImg()

		// edit invite message
		const hmInvEmbed = new MessageEmbed()
			.setColor(game.texts.color)
			.setTitle(game.texts.title)
			.setDescription(`${game.players[1]}${game.texts.description}${game.players[2]}`)

			await interaction.editReply({
			embeds: [hmInvEmbed],
			components: []
		});

		// start the game loop
		while (game.winner === undefined) {
			if (await game.curGrid == undefined) {
				// ask for grid selection
				await selectGrid(game);
			} else {
				// ask for square selection
				await selectSquare(game);
			};
		}

		// announce winner
		await announceWinner(game);
	}
};