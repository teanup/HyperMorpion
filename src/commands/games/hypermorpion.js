const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getTrsln } = require('../../languages/fetch-lang');
const { startHmGame } = require('../../games/hypermorpion/start-hm-game');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hypermorpion')
 		.setDescription('Start a game of HyperMorpion with a friend')
		.addUserOption(option => 
			option.setName('member')
				.setDescription('Select who you want to play with')
				.setRequired(true)),
	async execute(interaction, client) {

		// get translated texts and concerned players
		const guildId = interaction.guild.id
		const gameInvTexts = await getTrsln(guildId, 'gameInvite');
		const hmInvTexts = await getTrsln(guildId, 'hmInvite');
		const player1Id = interaction.user.id;
		const player2Id = interaction.options.getUser('member', true).id;

		// make invite embed
		const hmInvEmbed = new MessageEmbed()
			.setColor(hmInvTexts.color)
			.setTitle(hmInvTexts.title)
			.setDescription(`${hmInvTexts.description[0]}<@${player2Id}>${hmInvTexts.description[1]}<@${player1Id}>${hmInvTexts.description[2]}`);

		// invite request buttons
		const invRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('hm-inv-accept')
					.setLabel(gameInvTexts.accept)
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('hm-inv-decline')
					.setLabel(gameInvTexts.decline)
					.setStyle('DANGER')
				);

		// invite message
		await interaction.reply({
			embeds: [hmInvEmbed],
			components: [invRow]
		});
		const invMsg = await interaction.fetchReply();

		// wait for reply
		const filter = invInter => invInter.user.id === player2Id;
		await invMsg.awaitMessageComponent({ filter, time: gameInvTexts.delay*1000 })
		.then(async invInter => {
			await invInter.deferUpdate();
			const answer = invInter.customId;

			if (answer == 'hm-inv-decline') {
				// edit invite message
				hmInvEmbed.setDescription(gameInvTexts.refused);
				await interaction.editReply({
					embeds: [hmInvEmbed],
					components: []
				});
			} else {
				// start a game
				await startHmGame(player1Id, player2Id, interaction);
			}
		})
		.catch(async () => {
			// edit invite message
			hmInvEmbed.setDescription(`<@${player2Id}>${gameInvTexts.timeout}`);
			await interaction.editReply({
				embeds: [hmInvEmbed],
				components: []
			});
		});
	}
};