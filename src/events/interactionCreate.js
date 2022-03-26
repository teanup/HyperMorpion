// const { getGuildLang, getText } = require('../languages/fetch-lang')

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
			}
		// } else if (interaction.isSelectMenu()) {
		//	 if (interaction.customId == 'lang-select') {
		//		 const newLang = +interaction.values.at(0);
		//		 await editGuildLang(String(interaction.guild.id), newLang);
		//		 const text = getText(newLang, 'lang_changed');
		//		 await interaction.reply({
		// 			content: text
		//		 });
		//	 }
		// } else if (interaction.isButton()) {
		// 	const button = client.buttons.get(interaction.customId);
		// 	if (!button) return;

		// 	try {
		// 		await button.execute(interaction, client);
		// 	} catch (error) {
		// 		console.error(error);
		// 		await interaction.reply({
		// 			content: getText(getGuildLang(interaction.guild.id), 'error'),
		// 			ephemeral: true
		// 		});
			// }
		}
	}
};