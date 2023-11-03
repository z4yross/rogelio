import 'dotenv/config'
import debugLib from 'debug'

const debug = debugLib('rg_bot:main:log')
const error = debugLib('rg_bot:main:error')

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

const DEV_GUILD_ID = process.env.DEV_GUILD_ID

import { REST, Routes } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'

import { fileURLToPath, pathToFileURL } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commands = []

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
			commands.push(command.data.toJSON())
		else
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			)
	}
}

const rest = new REST().setToken(TOKEN)

const deployCommands = async (
	commands: any[],
	clientId: string,
	guildId?: string
) => {
	try {
		debug(
			`Started refreshing ${commands.length} application (/) commands. (guild: ${guildId}))`
		)

		let url = Routes.applicationCommands(clientId)

		if (guildId !== undefined || guildId !== null)
			url = Routes.applicationGuildCommands(clientId, guildId)

		const data = await rest.put(url, {
			body: commands,
		})

		// @ts-ignore
		debug(`Successfully reloaded ${data.length} applicatio n (/) commands.`)
	} catch (err) {
		error(err)
	}
}

if (process.env.NODE_ENV === 'production') deployCommands(commands, CLIENT_ID)
else await deployCommands(commands, CLIENT_ID, DEV_GUILD_ID)
