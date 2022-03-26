const Canvas = require('canvas');
const { getTrsln } = require('../../languages/fetch-lang');
const { getBoardData } = require('./util/get-board-data');
const { getBoardImage } = require('./util/get-board-image');
const { getGameEvolution } = require('./images/get-game-evol');

module.exports = {
	async getGame(player1Id, player2Id, originMessage) {
		const Game = {
			// players competing
			playersId: { 1: player1Id, 2: player2Id },
			players: { 1: `<@${player1Id}> \ud83c\uddfd`, 2: `<@${player2Id}> \ud83c\udd7e\ufe0f` },
			// game starting message
			message: originMessage,
            // selection delay
            selSquareDelay: 120,
            selGridDelay: 60,
			// text translations
			texts: await getTrsln(originMessage.guild.id, 'hypermorpion'),
			// board information
			board: await getBoardData(),
			// game image
			image: await getBoardImage(),
			// current grid to be played in
			curGrid: undefined,
			// current player playing
			curPlayer: 1,
			winner: undefined,
			// evolution of the game canvas array
			prevImages: [],
			async storeCurImg() {
				const curImg = this.image.image;
				
				const copyImg = Canvas.createCanvas(curImg.width, curImg.height);
				const copyCtx = copyImg.getContext('2d')
				copyCtx.drawImage(curImg, 0, 0);
				
				this.prevImages.push(copyCtx);
			},
			// play method to let a player play in a square
			async play(squareId) {
				const grid = await this.board.grids[this.curGrid];
				await grid.play(this.curPlayer, squareId);

				const gridWinner = await grid.winner;

				if (gridWinner !== undefined) {
					await this.board.equivGrid.play(gridWinner, this.curGrid);
					await this.image.completeGrid(gridWinner, this.curGrid);
					this.winner = await this.board.equivGrid.winner;
				} else {
					await this.image.play(this.curPlayer, this.curGrid, squareId);
				};

				await this.storeCurImg();

				this.curPlayer = 3 - this.curPlayer;

				if ((await this.board.equivGrid.squares[squareId]) !== undefined) {
					this.curGrid = undefined;
				} else {
					this.curGrid = squareId;
				}
			},
			async getGameEvolution() {
				return await getGameEvolution(this);
			}
		};
		return Game;
	}
};