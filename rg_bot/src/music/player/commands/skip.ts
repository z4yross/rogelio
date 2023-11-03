import debugLib from 'debug'
const debug = debugLib('rg_bot:music:player:skip')
const error = debugLib('rg_bot:music:player:skip:error')

import { CommandInteraction } from 'discord.js'
import { Command, RogelioPlayerManager } from '../player.js'

type Args = {}

export const name: string = 'skip'

export const execute = async (
	interaction: CommandInteraction,
	playerManager: RogelioPlayerManager,
	args: Args
): Promise<string> => {
	const player = await playerManager.getGuildPlayer(interaction)

	if (!player) throw new Error('No player found.')

	if (player.queue.size === 0) throw new Error('No songs in queue.')

	player.stop()
	return 'Skipped'
}
