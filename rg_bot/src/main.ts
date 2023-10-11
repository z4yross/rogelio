import 'dotenv/config'
import debugLib from 'debug'

const debug = debugLib('rg_bot:main:log')
const error = debugLib('rg_bot:main:error')

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

import { Client, Collection, GatewayIntentBits } from 'discord.js'
import path from 'path'
import fs from 'fs'

import { getManager, commitConnectionEvents } from './music/provider.js'

import { fileURLToPath, pathToFileURL } from 'url'
import { initManagerEvents } from './speech/interpreter.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})

// @ts-ignore
client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder)

	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.ts'))

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		const fileURL = pathToFileURL(filePath).toString()

		const command = await import(fileURL)
		if ('data' in command && 'execute' in command) {
			// @ts-ignore
			client.commands.set(command.data.name, command)
		} else {
			error(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			)
		}
	}
}

// @ts-ignore
client.manager = await getManager(client)
// @ts-ignore
await commitConnectionEvents(client.manager)

await initManagerEvents()

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.ts'))

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file)
	const fileURL = pathToFileURL(filePath).toString()
	const event = await import(fileURL)

	if (event.once)
		client.once(event.name, (...args) => event.execute(client, ...args))
	else client.on(event.name, (...args) => event.execute(client, ...args))
}

client.login(TOKEN)
