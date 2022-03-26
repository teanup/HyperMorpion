const { getGame } = require('./get-game');
const { getStartingComponents, selectSquare, announceWinner } = require('./game-interactions');

module.exports = {
	async startTttGame(player1Id, player2Id, interaction) {
		// initialize game
		const game = await getGame(player1Id, player2Id, interaction);
        
		// edit invite message
		await interaction.editReply({
			components: await getStartingComponents()
		});

		const embedDescription = `${game.players[1]}${game.texts.description[0]}${game.players[2]}${game.texts.description[1]}\n\n`;
		// start the game loop
		while (game.winner === undefined) {
			// ask for square selection
			await selectSquare(game, embedDescription);
		}

		// announce winner
		await announceWinner(game);
	}
};