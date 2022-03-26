const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { inviteLink } = require('../../config.json');
const { getTrsln } = require('../../languages/fetch-lang')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Information about the bot and its creation'),
	async execute(interaction, client) {
		// get translated texts
		const infoTexts = await getTrsln(interaction.guild.id, 'info');
		
		// make embed
		const infoEmbed = new MessageEmbed()
			.setColor(infoTexts.color)
			.setTitle(infoTexts.title)
			.addFields(infoTexts.fields);

		// invite button
		const infoRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel(infoTexts.inviteBtn)
					.setStyle('LINK')
					.setURL(inviteLink)
			);

		// send info panel
		await interaction.reply({
			embeds: [infoEmbed],
			components: [infoRow]
		});
	},
};