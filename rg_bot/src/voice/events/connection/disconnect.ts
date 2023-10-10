import debugLib from 'debug'

const debug = debugLib('rg_bot:voice:event:disonnect')
const error = debugLib('rg_bot:voice:event:disonnect:error')

import {
	VoiceConnectionStatus,
	VoiceConnectionState,
	entersState,
	getVoiceConnection,
	VoiceConnection,
} from '@discordjs/voice'

export const state = VoiceConnectionStatus.Disconnected

export const execute = async (
	oldState: VoiceConnectionState,
	newState: VoiceConnectionState,
	connection: VoiceConnection
) => {
	debug(`Voice state updated: ${oldState.status} -> ${newState.status}`)

	try {
		await Promise.race([
			entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
			entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
		])
	} catch (error) {
		connection.destroy()
	}
}
