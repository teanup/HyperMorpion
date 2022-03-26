const { getTrsln } = require('../../languages/fetch-lang');
const { getWinner } = require('./get-winner');

module.exports = {
	async getGame(player1Id, player2Id, originInteraction) {
		const Game = {
			// players competing
			playersId: { 1: player1Id, 2: player2Id },
			players: { 1: `<@${player1Id}> \ud83c\uddfd`, 2: `<@${player2Id}> \ud83c\udd7e\ufe0f` },
			// game starting message
			interaction: originInteraction,
            // selection delay
            selSquareDelay: 30,
			// text translations
			texts: await getTrsln(originInteraction.guild.id, 'tictactoe'),
			// current player playing
			curPlayer: 1,
			winner: undefined,
            squares: [
				undefined, undefined, undefined,
				undefined, undefined, undefined,
				undefined, undefined, undefined
			],
            fullSquares: 0,
            // play method to let a player play in a square
            async play(squareId) {
                this.squares[squareId] = this.curPlayer;

                const btnInfo = {
                    1: ['player1:940926306974056468', 'PRIMARY'],
                    2: ['player2:940926307171176458', 'DANGER']
                };
                const [emoji, style] = btnInfo[this.curPlayer];
                // edit the clicked button
                const msg = await this.interaction.fetchReply();
                const components = await msg.components;
                const button = await components[Math.floor(squareId/3)].components[squareId%3];
                button.setEmoji(emoji)
                    .setStyle(style)
                    .setDisabled(true);
                await this.interaction.editReply({
                    components: components
                });
                // set winner
                if (this.fullSquares == 8) {
                    this.winner = 3;
                } else {
                    this.winner = await getWinner(this.squares);
                };

                this.fullSquares++;
                this.curPlayer = 3 - this.curPlayer;
            },
		};
		return Game;
	}
};