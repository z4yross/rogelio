import debugLib from 'debug'

const debug = debugLib('rg_bot:voice:event:signaling')
const error = debugLib('rg_bot:voice:event:signaling:error')

import { VoiceConnectionStatus, VoiceConnectionState, VoiceConnection } from '@discordjs/voice'

export const state = VoiceConnectionStatus.Signalling

export const execute = async (
	oldState: VoiceConnectionState,
	newState: VoiceConnectionState,
	connection: VoiceConnection
) => {
	debug(`Voice state updated: ${oldState.status} -> ${newState.status}`)
}
