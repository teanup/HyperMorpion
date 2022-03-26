const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getTrsln } = require('../../languages/fetch-lang')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check the current bot\'s latency'),
	async execute(interaction, client) {
		// get translated texts
		const pingTexts = await getTrsln(interaction.guild.id, 'ping');

		// get current latency
		const latency = Math.abs(Date.now() - interaction.createdTimestamp);

		// pick emoji
		let emoji = undefined;
		// horse emoji
		if (latency < 20) emoji = '\uD83D\uDC0E';
		// kangaroo emoji
		else if (latency < 40) emoji = '\uD83E\uDD98';
		// rabbit emoji
		else if (latency < 80) emoji = '\uD83D\uDC07';
		// turtle emoji
		else if (latency < 160) emoji = '\uD83D\uDC22';
		// snail emoji
		else emoji = '\uD83D\uDC0C';

		// send embed with latency
		const pingEmbed = new MessageEmbed()
			.setColor(pingTexts.color)
			.setTitle(pingTexts.title)
			.setDescription(`${pingTexts.description}${latency} ms** \t ${emoji}`);
		await interaction.reply({
			embeds: [pingEmbed]
		});
	},
};