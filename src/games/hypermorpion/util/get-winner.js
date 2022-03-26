module.exports = {
	async getWinner(squares) {
		// returns the winner of a 9 squares grid if any
		let winner = undefined;
		// all 8 possible winning configurations
		const winningConfigs = [
			[0, 1, 2],
			[0, 4, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 4, 6],
			[2, 5, 8],
			[3, 4, 5],
			[6, 7, 8]
		];
		// checks if any configuration is present
		winningConfigs.forEach(config => {
			let plyr = squares[config[0]];
			if ((plyr == 1 || plyr == 2)
				&& plyr == squares[config[1]]
				&& plyr == squares[config[2]]) {
				winner = plyr;
				return false;
			};
		});
		return winner;
	}
};