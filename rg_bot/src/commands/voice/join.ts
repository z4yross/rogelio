import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:join')
const error = debugLib('rg_bot:commands:join:error')

import {
	SlashCommandBuilder,
	CommandInteraction,
	GuildMember,
} from 'discord.js'
import {
	VoiceConnection,
	joinVoiceChannel,
	VoiceReceiver,
	createDefaultAudioReceiveStreamOptions,
	EndBehaviorType,
} from '@discordjs/voice'

import * as prism from 'prism-media'

import { commitConnectionEvents } from '../../voice/utils/commitEvents.js'

import fs from 'fs'
import { Recognition } from '../../speech/recognition.js'

const setupConnection = async (
	interaction: CommandInteraction,
	connection: VoiceConnection
) => {
	await commitConnectionEvents(connection)

	const receiver = connection.receiver as VoiceReceiver
	const interactionMember = interaction.member as GuildMember

	// get all users that are in the voice channel
	const users = interactionMember.voice.channel.members

	users.forEach((user) => {
		if (user.user.bot) return

		const options = createDefaultAudioReceiveStreamOptions()

		options.end = {
			behavior: EndBehaviorType.Manual,
		}

		// @ts-ignore
		const receiverStream = receiver.subscribe(user.id, options)

		const opusDecoder = new prism.opus.Decoder({
			frameSize: 4000,
			channels: 1,
			rate: 16000,
		})

		debug(`Subscribed to ${user.user.username}`)

		const recognizer = new Recognition(16000, user)
		recognizer.recognize(receiverStream, opusDecoder)
	})
}

export const data = new SlashCommandBuilder()
	.setName('join')
	.setDescription('Joins the voice channel you are in.')

export async function execute(interaction: CommandInteraction) {
	const interactionMember = interaction.member as GuildMember

	if (!interactionMember.voice || !interactionMember.voice.channel) {
		return await interaction.reply(
			'You must be in a voice channel to use this command.'
		)
	}

	const connectionParams = {
		// @ts-ignore
		channelId: interaction.member.voice.channel.id,
		guildId: interaction.guild.id,
		adapterCreator: interaction.guild.voiceAdapterCreator,
		selfDeaf: false,
		selfMute: false,
	}

	try {
		const connection = joinVoiceChannel(connectionParams)
		await setupConnection(interaction, connection)

		await interaction.reply(
			`Joined ${interactionMember.voice.channel.name}`
		)
	} catch (err) {
		error(err)
	}
}

// interactionOrMessage: CommandInteraction | Message, arguments?: string
