import debugLib from 'debug'

const debug = debugLib('rg_bot:speech:interpreter:event:stop')
const error = debugLib('rg_bot:speech:interpreter:event:stop:error')

import {
	InterpretationEvent,
	InterpretationEventPayload,
} from '../interpreter.js'
import { BaseGuildTextChannel, GuildMember, TextChannel } from 'discord.js'
import { RogelioClient } from '../../client/RogelioClient.js'

export const eventName = InterpretationEvent.STOP

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

	if (!player.playing) {
		await textChannel.send('the player is not playing.')
		return
	}

	player.destroy()
	await textChannel.send(`stopping ${player.queue.current.title}.`)
	return
}
