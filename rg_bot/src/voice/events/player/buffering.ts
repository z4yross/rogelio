import debugLib from 'debug'

const debug = debugLib('rg_bot:voice:event:player:buffering')
const error = debugLib('rg_bot:voice:event:player:buffering:error')

import {
	AudioPlayerStatus,
	AudioPlayerState,
	AudioPlayer,
} from '@discordjs/voice'

export const state = AudioPlayerStatus.Buffering

export const execute = async (
	oldState: AudioPlayerState,
	newState: AudioPlayerState,
	player: AudioPlayer
) => {
	debug(`Player state updated: ${oldState.status} -> ${newState.status}`)
}
