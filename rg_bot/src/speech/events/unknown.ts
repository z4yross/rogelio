import debugLib from 'debug'

const debug = debugLib('rg_bot:speech:interpreter:event:unknown')
const error = debugLib('rg_bot:speech:interpreter:event:unknown:error')

import {
	InterpretationEvent,
	InterpretationEventPayload,
} from '../interpreter.js'
import { BaseGuildTextChannel, GuildMember } from 'discord.js'

export const eventName = InterpretationEvent.UNKNOWN

export const once = false

export const handler = async (payload: InterpretationEventPayload) => {	
	const client = payload.interaction.client
	const channelId = payload.interaction.channel.id
	debug(`channelId: ${channelId}`)
	const textChannel = client.channels.cache.get(
		channelId
	) as BaseGuildTextChannel

	await textChannel.send(`${payload.assistant}`)
}

