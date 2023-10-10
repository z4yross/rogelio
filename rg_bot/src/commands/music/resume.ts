import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:resume')
const error = debugLib('rg_bot:commands:resume:error')

import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('resume')
	.setDescription('Pauses the current song.')

export async function execute(interaction: CommandInteraction) {
	// @ts-ignore
	if (!interaction.member.voice || !interaction.member.voice.channel) {
		return interaction.reply({
			content: 'You must be in a voice channel to use this command.',
			ephemeral: true,
		})
	}

	const player = interaction.client.manager.get(interaction.guild.id)

	if (!player) {
		return interaction.reply({
			content: 'I am not in a voice channel.',
			ephemeral: true,
		})
	}

	if (!player.paused) {
		return interaction.reply({
			content: 'The player is not paused.',
			ephemeral: true,
		})
	}

	try {
		player.play()
	} catch (err) {
		error(err)
		return interaction.reply(
			`there was an error while resuming: ${err.message}`
		)
	}

	await interaction.reply('Resumed.')
}
