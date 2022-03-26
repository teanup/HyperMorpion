const Canvas = require('canvas');
const { border, sqSz, gdSz, boardSz,
	getBaseImage,
	getXSqImage,
	getOSqImage,
	getXGdImage,
	getOGdImage,
	getNullGdImage,
	getHgltdImage 
} = require('../images/image-basis')


module.exports = {
	// returns the board image object 
	async getBoardImage() {
		// returns coordinates on the canvas for a specific grid
		const getGdCoord = ((gridId) => {
			const x = (gridId % 3) * gdSz + 2 * border;
			const y = Math.floor(gridId / 3) * gdSz + 2 * border;
			return [x, y];
		});

		// returns coordinates on the canvas for a specific square
		const getSqCoord = ((gridId, squareId) => {
			const [xGd, yGd] = getGdCoord(gridId);
			const x = xGd + (squareId % 3) * (sqSz + border);
			const y = yGd + Math.floor(squareId / 3) * (sqSz + border);
			return [x, y];
		});

		// board image object
		const boardImage = {
			// image of the game
			image: await getBaseImage(),
			// play method to let a player play in a square
			async play(player, gridId, squareId) {
				const [x, y] = getSqCoord(gridId, squareId);
				const context = await this.image.getContext('2d');
				if (player == 1) {
					await context.drawImage(await (getXSqImage()), x, y);
				};
				if (player == 2) {
					await context.drawImage(await (getOSqImage()), x, y);
				};
			},
			// grid completing method when a grid is full or won
			async completeGrid(player, gridId) {
				const [x, y] = getGdCoord(gridId);
				const context = await this.image.getContext('2d');
				if (player == 1) {
					await context.drawImage(await (getXGdImage()), x, y);
				} else if (player == 2) {
					await context.drawImage(await (getOGdImage()), x, y);
				} else if (player == 3) {
					await context.drawImage(await (getNullGdImage()), x, y);
				};
			},
			// highlighted version of the game image
			async getHighlighted(gridList) {
				const hgltd = await Canvas.createCanvas(boardSz, boardSz);
				const context = hgltd.getContext('2d');
				await context.drawImage(this.image, 0, 0);
				const hlImage = await (getHgltdImage());
				gridList.forEach(gridId => {
					const [x, y] = getGdCoord(gridId);
					context.drawImage(hlImage, x-border, y-border);
				});
				return hgltd;
			}
		}
		return boardImage;
	}
};