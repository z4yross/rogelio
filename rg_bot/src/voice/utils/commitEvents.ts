import debugLib from 'debug'

const debug = debugLib('rg_bot:main:log')
const error = debugLib('rg_bot:main:error')

import { AudioPlayer, VoiceConnection } from '@discordjs/voice'
import path from 'path'
import fs from 'fs'

import { fileURLToPath, pathToFileURL } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const commitPlayerEvents = async (player: AudioPlayer) => {
	const foldersPath = path.join(__dirname, '../events/player')

	const eventFiles = fs
		.readdirSync(foldersPath)
		.filter((file) => file.endsWith('.ts'))

	for (const file of eventFiles) {
		const filePath = path.join(foldersPath, file)
		const fileURL = pathToFileURL(filePath).toString()
		const event = await import(fileURL)

		if (event.once)
			player.once(event.state, (...args) => event.execute(...args, player))
		else player.on(event.state, (...args) => event.execute(...args, player))
	}
}

export const commitConnectionEvents = async (connection: VoiceConnection) => {
	const foldersPath = path.join(__dirname, '../events/connection')

	const eventFiles = fs
		.readdirSync(foldersPath)
		.filter((file) => file.endsWith('.ts'))

	for (const file of eventFiles) {
		const filePath = path.join(foldersPath, file)
		const fileURL = pathToFileURL(filePath).toString()
		const event = await import(fileURL)

		if (event.once)
			connection.once(event.state, (...args) => event.execute(...args, connection))
		else connection.on(event.state, (...args) => event.execute(...args, connection))
	}
}
