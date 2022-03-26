const { getWinner } = require('./get-winner')

module.exports = {
	async getGrid() {
		const Grid = {
			// all 9 squares of a grid
			squares: [
				undefined, undefined, undefined,
				undefined, undefined, undefined,
				undefined, undefined, undefined
			],
			// number of filled squares
			fullSquares: 0,
			// winner of the grid
			winner: undefined,
			// play method to let a player play in a square
			async play(player, squareId) {
				this.squares[squareId] = player;
				const winner = await getWinner(this.squares);
				if (winner !== undefined) {
					this.winner = winner;
				} else if (this.fullSquares == 8) {
					this.winner = 3;
				};
				this.fullSquares++;
			},
			// returns the array of available squares
			async availableSquares() {
				let availSq = [];
				for (let squareId = 0; squareId < 9; squareId++) {
					if (this.squares[squareId] === undefined) availSq.push(squareId);
				}
				return availSq
			}
		}
		return Grid;
	}
};