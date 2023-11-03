import debugLib from 'debug'

const debug = debugLib('rg_bot:speech:interpreter:event:next')
const error = debugLib('rg_bot:speech:interpreter:event:next:error')

import {
	InterpretationEvent,
	InterpretationEventPayload,
} from '../interpreter.js'
import { BaseGuildTextChannel, GuildMember, TextChannel } from 'discord.js'
import { RogelioClient } from '../../client/rogelioclient.js'
import { RogelioPlayerManager } from '../../music/player/player.js'

export const eventName = InterpretationEvent.NEXT

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
			'skip',
			payload.interaction,
			{}
		)

		await textChannel.send(response)
	} catch (err) {
		textChannel.send(`There was an error while pausing: ${err.message}`)
	}
}
