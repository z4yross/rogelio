import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:resume')
const error = debugLib('rg_bot:commands:resume:error')

import { SlashCommandBuilder, CommandInteraction, GuildMember } from 'discord.js'
import { RogelioClient } from '../../client/RogelioClient.js'

export const data = new SlashCommandBuilder()
	.setName('resume')
	.setDescription('Pauses the current song.')

export async function execute(interaction: CommandInteraction) {
	const member = interaction.member as GuildMember
	const client = interaction.client as RogelioClient

	if (!member.voice || !member.voice.channel) {
		return interaction.reply({
			content: 'You must be in a voice channel to use this command.',
			ephemeral: true,
		})
	}

	const player = client.musicClient.manager.get(interaction.guild.id)

	if (player === undefined) {
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

	player.pause(false)
	await interaction.reply('Resuming ${player.queue.current.title}.')
}
