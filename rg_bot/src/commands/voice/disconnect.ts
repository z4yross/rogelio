import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:disconnect')
const error = debugLib('rg_bot:commands:disconnect:error')

import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'

export const data = new SlashCommandBuilder()
	.setName('leave')
	.setDescription('Leaves the voice channel you are in.')

export async function execute(interaction: CommandInteraction) {
	const guildId = interaction.guild.id

	if (!interaction.member.voice || !interaction.member.voice.channel) {
		return await interaction.reply(
			'You must be in a voice channel to use this command.'
		)
	}

	try {
		const connection = getVoiceConnection(guildId)

		if (!connection)
			return await interaction.reply('I am not in a voice channel.')

		if (
			connection.joinConfig.channelId !==
			interaction.member.voice.channel.id
		)
			return await interaction.reply('I am not in your voice channel.')

		connection.destroy()
		await interaction.reply(`Left ${interaction.member.voice.channel.name}`)
	} catch (err) {
		error(err)
	}
}

// interactionOrMessage: CommandInteraction | Message, arguments?: string
