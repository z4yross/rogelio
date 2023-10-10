import debugLib from 'debug'

const debug = debugLib('rg_bot:voice:event:player:idle')
const error = debugLib('rg_bot:voice:event:player:idle:error')

import { AudioPlayerStatus, AudioPlayerState, AudioPlayer } from '@discordjs/voice'

export const state = AudioPlayerStatus.Idle

export const execute = async (
	oldState: AudioPlayerState,
	newState: AudioPlayerState,
	player: AudioPlayer
) => {
	debug(`Player state updated: ${oldState.status} -> ${newState.status}`)
}
