import debugLib from 'debug'

const debug = debugLib('rg_bot:voice:event:player:error')
const error = debugLib('rg_bot:voice:event:player:error:error')

import {
	AudioPlayerStatus,
	AudioPlayerState,
	AudioPlayer,
} from '@discordjs/voice'

export const state = 'error'

export const execute = async (err: Error, player: AudioPlayer) => {
	debug(`Player error: ${err.message}`)
}
