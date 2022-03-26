const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	async getComponents(squares) {
		const rowList = [];
		const btnInfo = {
			1: ['player1:940926306974056468', 'PRIMARY'],
			2: ['player2:940926307171176458', 'DANGER'],
			3: ['player3:940926307087286332', 'SECONDARY']
		}

		// get all rows
		for (let rowId = 0; rowId <= 2; rowId++) {
			let row = new MessageActionRow();
			// get all buttons of row
			for (let btnId = 3*rowId; btnId <= 3*rowId +2; btnId++) {
				let plyr = squares[btnId];
				// button settings
				let button = new MessageButton()
				if (plyr === undefined) {
					button
						.setCustomId(String(btnId))
						.setLabel(' ')
						.setStyle('SECONDARY')
						.setDisabled(false);
				} else {
					[emoji, style] = btnInfo[plyr];
					button
						.setCustomId(String(btnId))
						.setEmoji(emoji)
						.setStyle(style)
						.setDisabled(true);
				};
				// add button to row
				row.addComponents(button);
			};
			rowList.push(row);
		};
		return rowList;
	}
};