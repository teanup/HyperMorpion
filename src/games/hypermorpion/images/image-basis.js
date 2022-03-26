const Canvas = require('canvas');
const { borderWidth, squareSize, resizeCoeff } = require('./image-config.json');


const gridSize = 3 * (squareSize + borderWidth) + borderWidth;
const boardSize = 3 * gridSize + 2;

module.exports = {

	border: borderWidth * resizeCoeff,
	sqSz: squareSize * resizeCoeff,
	gdSz: gridSize * resizeCoeff,
	boardSz: boardSize * resizeCoeff,


    async getBaseImage() {
        const canvas = Canvas.createCanvas(boardSize * resizeCoeff, boardSize * resizeCoeff);
        canvas.getContext('2d')
			.drawImage(
				await Canvas.loadImage(`${__dirname}/base.png`),
				0, 0, canvas.width, canvas.height);
        return canvas;
    },

	async getXSqImage() {
		return await Canvas.loadImage(`${__dirname}/cross-sq.png`)
	},

	async getOSqImage() {
		return await Canvas.loadImage(`${__dirname}/round-sq.png`)
	},

	async getXGdImage() {
		return await Canvas.loadImage(`${__dirname}/cross-gd.png`)
	},

	async getOGdImage() {
		return await Canvas.loadImage(`${__dirname}/round-gd.png`)
	},

	async getNullGdImage() {
		return await Canvas.loadImage(`${__dirname}/null-gd.png`)
	},

	async getHgltdImage() {
		return await Canvas.loadImage(`${__dirname}/highlighted.png`)
	},
};