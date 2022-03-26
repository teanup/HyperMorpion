const { MessageAttachment, MessageEmbed } = require('discord.js');
const { getComponents } = require('./get-components');

module.exports = {
	async selectGrid(game) {
		// get translated texts and useful objects
		const selGridTexts = await game.texts.selGrid;
		const grids = (await game).board.equivGrid;
		let delay = 0+game.texts.selGridDelay;
		let played = false;

		// get image with highlighted grids
		const hglted = await (await game).image.getHighlighted(await grids.availableSquares());
		const attachment = new MessageAttachment(hglted.toBuffer(), 'hypermorpion.png');

		// make selection embed
		const selGridEmbed = new MessageEmbed()
			.setColor(game.texts.color)
			.setImage('attachment://hypermorpion.png');

		// ask for grid selection
		const gridMsg = await game.message.reply({
			files: [attachment],
			components: await getComponents(grids.squares),
			embeds: [selGridEmbed]
		});
		const filter = btnInter => btnInter.user.id == game.playersId[game.curPlayer];
		while (delay > 0 && (!played)) {
			selGridEmbed.setDescription(
				`**${game.players[game.curPlayer]}${selGridTexts[0]}**\n${selGridTexts[1]}${delay}${selGridTexts[2]}`
			);
			await gridMsg.edit({
				embeds: [selGridEmbed]
			});

			// wait for selection
			await gridMsg.awaitMessageComponent({ filter, time: 10000 })
			.then(async btnInter => {
				game.curGrid = +btnInter.customId;
				played = true;
			})
			.catch(async () => delay -= 10);
		};
		// delete current message
		await gridMsg.delete();

		// if timeout
		if (!played) { game.winner = 4 };
	},
	async selectSquare(game) {
		// get translated texts and useful objects
		const selSquareTexts = game.texts.selSquare;
		let delay = 0+game.texts.selSquareDelay;
		let played = false;

		// get image with highlighted grid
		const hglted = await (await game).image.getHighlighted([game.curGrid]);
		const attachment = new MessageAttachment(hglted.toBuffer(), 'hypermorpion.png');

		// make selection embed
		const selSquareEmbed = new MessageEmbed()
			.setColor(game.texts.color)
			.setImage('attachment://hypermorpion.png');

		// ask for square selection
		const squareMsg = await game.message.reply({
			files: [attachment],
			components: await getComponents(await game.board.grids[await game.curGrid].squares),
			embeds: [selSquareEmbed]
		});
		const filter = btnInter => btnInter.user.id == game.playersId[game.curPlayer];
		while (delay > 0 && (!played)) {
			selSquareEmbed.setDescription(
				`**${game.players[game.curPlayer]}${selSquareTexts[0]}**\n${selSquareTexts[1]}${delay}${selSquareTexts[2]}`
			);
			await squareMsg.edit({
				embeds: [selSquareEmbed]
			});

			// wait for selection
			await squareMsg.awaitMessageComponent({ filter, time: 10000 })
			.then(async btnInter => {
				await game.play(+btnInter.customId);
				played = true;
			})
			.catch(async () => delay -= 10);
		};
		// delete current message
		await squareMsg.delete();

		// if timeout
		if (!played) { game.winner = 4 };
	},
	async announceWinner(game) {
		// get winner and summary gif
		const winner = game.winner;
		const attachment = new MessageAttachment(await game.getGameEvolution(), 'hypermorpion.gif');

		// get message content
		let content = '';
		switch(winner) {
			case 4:
				content = game.texts.shortened;
				break;
			case 3:
				content = game.texts.tie;
				break;
			default:
				content = `${game.players[winner]}${game.texts.win[0]}${game.players[3-winner]}${game.texts.win[1]}`;
		}

		// make announcement embed
		const anncmtEmbed = new MessageEmbed()
			.setColor(game.texts.color)
			.setDescription(content)
			.setImage('attachment://hypermorpion.gif');

		// send summary
		await game.message.reply({
			embeds: [anncmtEmbed],
			files: [attachment]
		});
	},
};