import debugLib from 'debug'

const debug = debugLib('rg_bot:voice:event:ready')
const error = debugLib('rg_bot:voice:event:ready:error')

import { VoiceConnectionStatus, VoiceConnectionState, VoiceConnection, VoiceReceiver, createDefaultAudioReceiveStreamOptions, VoiceUserData } from '@discordjs/voice'

export const state = VoiceConnectionStatus.Ready

export const execute = async (
	oldState: VoiceConnectionState,
	newState: VoiceConnectionState,
	connection: VoiceConnection
) => {
	debug(`Voice state updated: ${oldState.status} -> ${newState.status}`)
}
