import debugLib from 'debug'
const debug = debugLib('rg_bot:music:player:pause')
const error = debugLib('rg_bot:music:player:pause:error')

import { CacheType, CommandInteraction } from 'discord.js'
import { Command, RogelioPlayerManager } from '../player.js'

import { SearchResult } from 'magmastream'

type Args = {
	pause: boolean
}

export const name: string = 'pause'

export const execute = async (
	interaction: CommandInteraction,
	playerManager: RogelioPlayerManager,
	args: Args
): Promise<string> => {
	const player = await playerManager.getGuildPlayer(interaction)

	if (!player) throw new Error('No player found.')

	if (args.pause && player.paused)
		return 'Player is already paused.'

	if (!args.pause && player.playing)
		return 'Player is already playing.'

	player.pause(args.pause)
	return 'Paused'
}
