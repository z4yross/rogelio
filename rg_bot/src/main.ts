import 'dotenv/config'
import debugLib from 'debug'

const debug = debugLib('rg_bot:main:log')
const error = debugLib('rg_bot:main:error')

const TOKEN = process.env.TOKEN
const SECOND_TOKEN = process.env.SECOND_TOKEN
const CLIENT_ID = process.env.CLIENT_ID

import { GatewayIntentBits } from 'discord.js'

import path from 'path'
import fs from 'fs'

import { getManager, commitConnectionEvents } from './music/provider.js'

import { fileURLToPath, pathToFileURL } from 'url'
import { initManagerEvents } from './speech/interpreter.js'
import { ClientEvent, RogelioClient } from './client/RogelioClient.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new RogelioClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})

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

		if ('data' in command && 'execute' in command)
			client.addCommand(command)
		else {
			error(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			)
		}
	}
}

const manager = await getManager(client.musicClient)
client.addManager(manager)

await commitConnectionEvents(client.musicClient.manager)
await initManagerEvents()

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.ts'))

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file)
	const fileURL = pathToFileURL(filePath).toString()
	const event = (await import(fileURL)) as ClientEvent
	client.addEvent(event)
}

client.commit(TOKEN, SECOND_TOKEN)
