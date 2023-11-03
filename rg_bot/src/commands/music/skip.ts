import { RogelioClient } from '../../client/RogelioClient.js'
import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:skip')
const error = debugLib('rg_bot:commands:skip:error')

import {
	SlashCommandBuilder,
	CommandInteraction,
	GuildMember,
} from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('skip')
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

	const player = manager.get(interaction.guildId)

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

	player.stop()
	await interaction.reply('Skipped.')
}
