import debugLib from 'debug'
const debug = debugLib('rg_bot:music:provider')
const error = debugLib('rg_bot:music:provider:error')

import { Manager, ManagerOptions, NodeOptions } from 'magmastream'
import path from 'path'
import fs from 'fs'

import { fileURLToPath, pathToFileURL } from 'url'
import { Command, RogelioPlayerManager } from './player/player.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const nodes: NodeOptions[] = [
	{
		host: process.env.LAVALINK_HOST,
		port: parseInt(process.env.LAVALINK_PORT),
		password: process.env.LAVALINK_PASSWORD,
		identifier: 'rg_bot',
		retryAmount: 1000,
		retryDelay: 10000,
		resumeStatus: true, // default: false,
		resumeTimeout: 1000,
		secure: false, // default: false
	},
]

export const getManager = async (client: any) => {
	debug(`Loaded ${nodes.length} nodes.`)
	debug(`Connecting to nodes... with config: ${JSON.stringify(nodes)}`)

	const managerOptions: ManagerOptions = {
		nodes,
		send: (id, payload) => {
			const guild = client.guilds.cache.get(id)
			if (guild) guild.shard.send(payload)
		},
		autoPlay: true,
	}

	const manager = new RogelioPlayerManager(managerOptions)

	return manager
}

export const commitManagerEvents = async (manager: RogelioPlayerManager) => {
	const foldersPath = path.join(__dirname, './events')

	const eventFiles = fs
		.readdirSync(foldersPath)
		.filter((file) => file.endsWith('.ts'))

	for (const file of eventFiles) {
		const filePath = path.join(foldersPath, file)
		const fileURL = pathToFileURL(filePath).toString()
		const event = await import(fileURL)

		manager.addEvent(event)
	}
}

export const commitManagerCommands = async (manager: RogelioPlayerManager) => {
	const foldersPath = path.join(__dirname, './player/commands')

	const commandFiles = fs
		.readdirSync(foldersPath)
		.filter((file) => file.endsWith('.ts'))

	for (const file of commandFiles) {
		const filePath = path.join(foldersPath, file)
		const fileURL = pathToFileURL(filePath).toString()
		const commandFile = await import(fileURL) as Command

		manager.addCommand(commandFile)
	}
}
