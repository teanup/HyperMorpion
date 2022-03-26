const GIFEncoder = require('gifencoder');
const { boardSz } = require('./image-basis')

module.exports = {
	async getGameEvolution(game) {

		const encoder = new GIFEncoder(boardSz, boardSz);

		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(500);
		encoder.setQuality(10);

		await (game.prevImages).forEach(context => encoder.addFrame(context));

		lastImg = game.prevImages.at(-1)
		encoder.addFrame(lastImg);
		encoder.addFrame(lastImg);
		encoder.addFrame(lastImg);

		encoder.finish();

		return encoder.out.getData();
	}
};