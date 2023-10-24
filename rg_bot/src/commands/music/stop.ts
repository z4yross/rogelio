import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:stop')
const error = debugLib('rg_bot:commands:stop:error')

import {
	SlashCommandBuilder,
	CommandInteraction,
	GuildMember,
} from 'discord.js'
import { RogelioClient } from '../../client/RogelioClient.js'

export const data = new SlashCommandBuilder()
	.setName('stop')
	.setDescription('Skips the current song.')

export async function execute(interaction: CommandInteraction) {
	const client = interaction.client as RogelioClient
	const musciClient = client.musicClient
	const manager = musciClient.manager
	const member = interaction.member as GuildMember

	if (!member.voice || !member.voice.channel) {
		return interaction.reply({
			content: 'You must be in a voice channel to use this command.',
			ephemeral: true,
		})
	}

	const player = manager.get(interaction.guild.id)

	if (player === undefined) {
		return interaction.reply({
			content: 'I am not in a voice channel.',
			ephemeral: true,
		})
	}

	if (!player.playing) {
		return interaction.reply({
			content: 'The player is not playing.',
			ephemeral: true,
		})
	}

	player.destroy()
	await interaction.reply('Stopped.')
}
