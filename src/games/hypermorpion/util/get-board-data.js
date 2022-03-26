const { getGrid } = require('./get-grid');

module.exports = {
	async getBoardData() {
		const Board = {
			// the 9 playable grids of the board
			grids: {
				0: await getGrid(),
				1: await getGrid(),
				2: await getGrid(),
				3: await getGrid(),
				4: await getGrid(),
				5: await getGrid(),
				6: await getGrid(),
				7: await getGrid(),
				8: await getGrid()
			},
			// equivalent grid of the whole board to keep track of the wins
			equivGrid: await getGrid(),
			// winner of the board
			winner: undefined
		};
		return Board;
	}
};