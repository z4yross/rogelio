import debugLib from 'debug'

const debug = debugLib('rg_bot:speech:interpreter:event:resume')
const error = debugLib('rg_bot:speech:interpreter:event:resume:error')

import {
	InterpretationEvent,
	InterpretationEventPayload,
} from '../interpreter.js'
import { BaseGuildTextChannel, GuildMember, TextChannel } from 'discord.js'
import { RogelioClient } from '../../client/RogelioClient.js'

export const eventName = InterpretationEvent.RESUME

export const once = false

export const handler = async (payload: InterpretationEventPayload) => {
	const client = payload.interaction.client as RogelioClient
	const musciClient = client.musicClient
	const manager = musciClient.manager
	const channelId = payload.interaction.channelId
	const textChannel = client.channels.cache.get(
		channelId
	) as BaseGuildTextChannel

	await textChannel.send(`${payload.assistant}`)

	const player = manager.get(payload.interaction.guildId)

	if (player === undefined) {
		await textChannel.send('there is no player for this guild.')
		return
	}

	if(!player.paused) {
		await textChannel.send('the player is not paused.')
		return
	}

	player.pause(false)
	await textChannel.send(`resuming ${player.queue.current.title}.`)
	return
}