import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:pause')
const error = debugLib('rg_bot:commands:pause:error')

import {
	SlashCommandBuilder,
	CommandInteraction,
	GuildMember,
} from 'discord.js'
import { RogelioClient } from '../../client/RogelioClient.js'

export const data = new SlashCommandBuilder()
	.setName('pause')
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
			content: 'there is no player for this guild.',
			ephemeral: true,
		})
	}

	if (!player.playing) {
		return interaction.reply({
			content: 'The player is not playing.',
			ephemeral: true,
		})
	}

	player.pause(true)
	await interaction.reply(`Paused ${player.queue.current.title}.`)
}
