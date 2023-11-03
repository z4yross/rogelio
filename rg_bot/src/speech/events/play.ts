import debugLib from 'debug'

const debug = debugLib('rg_bot:speech:interpreter:event:play')
const error = debugLib('rg_bot:speech:interpreter:event:play:error')

import {
	InterpretationEvent,
	InterpretationEventPayload,
} from '../interpreter.js'
import { BaseGuildTextChannel, GuildMember, TextChannel } from 'discord.js'
import { RogelioClient } from '../../client/rogelioclient.js'
import { RogelioPlayerManager } from '../../music/player/player.js'

export const eventName = InterpretationEvent.PLAY

export const once = false

export const handler = async (payload: InterpretationEventPayload) => {
	const client = payload.interaction.client as RogelioClient
	const musciClient = client.musicClient
	const manager = musciClient.manager as RogelioPlayerManager

	const channelId = payload.interaction.channelId
	const textChannel = client.channels.cache.get(
		channelId
	) as BaseGuildTextChannel

	await textChannel.send(`${payload.assistant}`)

	try {
		const response = await manager.executeCommand(
			'play',
			payload.interaction,
			{
				search: payload.query,
			}
		)

		await textChannel.send(response)
	} catch (err) {
		textChannel.send(`there was an error while searching: ${err.message}`)
	}

	// const member = payload.interaction.member as GuildMember
	// const channelId = payload.interaction.channelId
	// const textChannel = client.channels.cache.get(
	// 	channelId
	// ) as BaseGuildTextChannel

	// await textChannel.send(`${payload.assistant}`)

	// let searchResponse

	// try {
	// 	searchResponse = await manager.search(payload.query)

	// 	if (searchResponse.loadType === 'empty') throw searchResponse.exception
	// 	if (searchResponse.loadType === 'playlist') {
	// 		throw { message: 'Playlists are not supported with this command.' }
	// 	}
	// } catch (err) {
	// 	error(err)

	// 	await textChannel.send(
	// 		`there was an error while searching: ${err.message}`
	// 	)

	// 	return
	// }

	// if (searchResponse.loadType === 'error') {
	// 	await textChannel.send('there was no tracks found with that query.')
	// 	return
	// }

	// let player = manager.get(payload.interaction.guildId)

	// if (player === undefined) {
	// 	player = manager.create({
	// 		guild: payload.interaction.guildId,
	// 		voiceChannel: member.voice.channel.id,
	// 		textChannel: channelId,
	// 		selfDeafen: false,
	// 		selfMute: false,
	// 		volume: 100,
	// 	})

	// 	player.connect()
	// }

	// player.queue.add(searchResponse.tracks[0])

	// if (!player.playing && !player.paused && !player.queue.size) {
	// 	player.play()
	// 	await textChannel.send(`playing ${searchResponse.tracks[0].title}.`)
	// 	return
	// }

	// await textChannel.send(`enqueuing ${searchResponse.tracks[0].title}.`)
}
