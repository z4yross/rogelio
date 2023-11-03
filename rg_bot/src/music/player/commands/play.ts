import debugLib from 'debug'
const debug = debugLib('rg_bot:music:player:play')
const error = debugLib('rg_bot:music:player:play:error')

import { CommandInteraction } from 'discord.js'
import { Command, RogelioPlayerManager } from '../player.js'

import { SearchResult } from 'magmastream'

type Args = {
	search: string
}

export const name: string = 'play'

export const execute = async (
	interaction: CommandInteraction,
	playerManager: RogelioPlayerManager,
	args: Args
): Promise<string> => {
	let searchResult: SearchResult

	try {
		searchResult = await playerManager.search(args.search)
	} catch (err) {
		error(err)
		throw err
	}

	const player = await playerManager.getGuildPlayer(interaction, true)

	if (
		searchResult.loadType === 'error' ||
		searchResult.loadType === 'empty' ||
		!searchResult.tracks.length
	)
		return 'No tracks found.'
	else if (searchResult.loadType === 'playlist')
		searchResult.tracks.forEach((track) => player.queue.add(track))
	else if (searchResult.loadType === 'search')
		player.queue.add(searchResult.tracks[0])
	else if (searchResult.loadType === 'track')
		player.queue.add(searchResult.tracks[0])

	if (!player.playing && !player.paused && !player.queue.size) {
		player.play()
		return `${searchResult.tracks[0].title}`
	}
}
