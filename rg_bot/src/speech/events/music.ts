import debugLib from 'debug'

const debug = debugLib('rg_bot:speech:interpreter:event:music')
const error = debugLib('rg_bot:speech:interpreter:event:music:error')

import {
	InterpretationEvent,
	InterpretationEventPayload,
} from '../interpreter.js'
import { BaseGuildTextChannel, GuildMember, TextChannel } from 'discord.js'

export const eventName = InterpretationEvent.MUSIC

export const once = false

export const handler = async (payload: InterpretationEventPayload) => {
	debug(`Handling event... ${payload.command}`)

	const member = payload.interaction.member as GuildMember

	// @ts-ignore
	const manager = payload.interaction.client.manager

	const client = payload.interaction.client
	const channelId = payload.interaction.channelId
	const textChannel = client.channels.cache.get(
		channelId
	) as BaseGuildTextChannel

	await textChannel.send(`${payload.assistant}`)

	let searchResponse

	try {
		searchResponse = await manager.search(payload.query)

		if (searchResponse.loadType === 'empty') throw searchResponse.exception
		if (searchResponse.loadType === 'playlist') {
			throw { message: 'Playlists are not supported with this command.' }
		}
	} catch (err) {
		error(err)

		await textChannel.send(
			`there was an error while searching: ${err.message}`
		)

		return
	}

	// try to get the player for the guild
	// @ts-ignore
	let player = payload.interaction.client.manager.get(
		payload.interaction.guildId
	)

	if (player === undefined) {
		// @ts-ignore
		player = payload.interaction.client.manager.create({
			guild: payload.interaction.guildId,
			voiceChannel: member.voice.channelId,
			textChannel: payload.interaction.channelId,
			selfDeafen: false,
			selfMute: false,
			volume: 100,
		})

		player.connect()
	}

	player.queue.add(searchResponse.tracks[0])

	if (!player.playing && !player.paused && !player.queue.size) {
		player.play()
		await textChannel.send(`playing ${searchResponse.tracks[0].title}.`)
		return
	}

	await textChannel.send(`enqueuing ${searchResponse.tracks[0].title}.`)
}
