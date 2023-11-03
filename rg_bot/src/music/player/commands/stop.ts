import debugLib from 'debug'
const debug = debugLib('rg_bot:music:player:stop')
const error = debugLib('rg_bot:music:player:stop:error')

import { CommandInteraction } from 'discord.js'
import { Command, RogelioPlayerManager } from '../player.js'

type Args = {}

export const name: string = 'stop'

export const execute = async (
	interaction: CommandInteraction,
	playerManager: RogelioPlayerManager,
	args: Args
): Promise<string> => {
	const player = await playerManager.getGuildPlayer(interaction)

	if (!player) throw new Error('No player found.')

	player.destroy()
	return 'Stopped'
}
