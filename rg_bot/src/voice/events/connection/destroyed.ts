import debugLib from 'debug'

const debug = debugLib('rg_bot:voice:event:destroyed')
const error = debugLib('rg_bot:voice:event:destroyed:error')

import { VoiceConnectionStatus, VoiceConnectionState, VoiceConnection } from '@discordjs/voice'

export const state = VoiceConnectionStatus.Destroyed

export const execute = async (
	oldState: VoiceConnectionState,
	newState: VoiceConnectionState,
	connection: VoiceConnection
) => {
	debug(`Voice state updated: ${oldState.status} -> ${newState.status}`)
}
