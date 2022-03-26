const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	async getStartingComponents() {
		let components = [];
		// get all rows
		for (let rowId = 0; rowId <= 2; rowId++) {
			let row = new MessageActionRow();
			// get all buttons of row
			for (let btnId = 3*rowId; btnId <= 3*rowId +2; btnId++) {
				// add button to row
				row.addComponents(
					new MessageButton()
						.setCustomId(String(btnId))
						.setLabel(' ')
						.setStyle('SECONDARY')
						.setDisabled(false),
				);
			};
			components.push(row);
		};
		return components
	},
	async selectSquare(game, embedDescription) {
		// get translated texts and useful objects
		const selSquareTexts = game.texts.selSquare;
		let delay = 0+game.texts.selSquareDelay;
		let played = false;

		// make selection embed
		const selSquareEmbed = new MessageEmbed()
			.setColor(game.texts.color)
			.setTitle(game.texts.title);

		// ask for square selection
		const filter = btnInter => btnInter.user.id == game.playersId[game.curPlayer];
		while (delay > 0 && (!played)) {
			selSquareEmbed.setDescription(
				embedDescription+`**${game.players[game.curPlayer]}${selSquareTexts[0]}**\n${selSquareTexts[1]}${delay}${selSquareTexts[2]}`
			);
			const squareMsg = await game.interaction.editReply({
				embeds: [selSquareEmbed]
			});

			// wait for selection
			await squareMsg.awaitMessageComponent({ filter, time: 10000 })
			.then(async btnInter => {
				await btnInter.deferUpdate();
				await game.play(+btnInter.customId);
				played = true;
			})
			.catch(async () => delay -= 10);
		};

		// if timeout
		if (!played) { game.winner = 4 };
	},
	async announceWinner(game) {
		// get winner and summary gif
		const winner = game.winner;

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
			.setDescription(content);
		
		// edit buttons
		const msg = await game.interaction.fetchReply();
		const components = await msg.components;
		await components.forEach(row => {
			row.components.forEach(btn => {
				btn.setDisabled(true);
			})
		});

		// send summary
		await game.interaction.editReply({
			embeds: [anncmtEmbed],
			components: components
		});
	},
};