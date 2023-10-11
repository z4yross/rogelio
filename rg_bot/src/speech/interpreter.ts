import debugLib from 'debug'

const debug = debugLib('rg_bot:speech:interpreter')
const error = debugLib('rg_bot:speech:interpreter:error')

import axios from 'axios'
import { CommandInteraction, GuildMember } from 'discord.js'

import { EventEmitter } from 'events'

import path from 'path'
import fs from 'fs'

import { fileURLToPath, pathToFileURL } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INTERPRETER_SERVER = process.env.INTERPRETER_SERVER || 'localhost'
const INTERPRETER_PORT = process.env.INTERPRETER_PORT || 5000
const INTERPRETER_URL = `http://${INTERPRETER_SERVER}:${INTERPRETER_PORT}`

type Interpretation = {
	command: string
	query: string
	platform: string
	assistant: string
}

export enum InterpretationEvent {
	UNKNOWN = 'unknown',
	MUSIC = 'music',
}

export type InterpretationEventPayload = {
	command: string
	query: string
	platform: string
	assistant: string
	interaction: CommandInteraction
}

export class Interpreter extends EventEmitter {
	constructor() {
		super()
	}

	async requestInterpretation(
		text: string,
		interaction: CommandInteraction
	): Promise<Interpretation> {
		const user = interaction.member as GuildMember

		const response = await axios.post(INTERPRETER_URL, {
			text,
			user: user.nickname || user.user.username,
		})

		debug(response.data)

		return response.data
	}

	async interpret(text: string, interaction: CommandInteraction) {
		const interpretation = await this.requestInterpretation(
			text,
			interaction
		)

		if (!interpretation) return

		interpretation.command =
			interpretation.command || InterpretationEvent.UNKNOWN
		interpretation.command = interpretation.command.toLowerCase()

		this.emit(interpretation.command, {
			command: interpretation.command,
			query: interpretation.query,
			platform: interpretation.platform,
			assistant: interpretation.assistant,
			interaction,
		} as InterpretationEventPayload)
	}
}

export class InterpretationManager extends Interpreter {
	private static instance: InterpretationManager

	private constructor() {
		super()
	}

	static getInstance() {
		if (!InterpretationManager.instance) {
			InterpretationManager.instance = new InterpretationManager()
		}

		return InterpretationManager.instance
	}

	static interpret(text: string, interaction: CommandInteraction) {
		InterpretationManager.getInstance().interpret(text, interaction)
	}

	static setListener(
		event: InterpretationEvent,
		once: boolean,
		listener: (payload: InterpretationEventPayload) => void
	) {
		const manager = InterpretationManager.getInstance()

		if (once) manager.once(event, listener)
		else manager.on(event, listener)
	}
}

export const initManagerEvents = async () => {
	const foldersPath = path.join(__dirname, './events')

	const eventFiles = fs
		.readdirSync(foldersPath)
		.filter((file) => file.endsWith('.ts'))

	for (const file of eventFiles) {
		const filePath = path.join(foldersPath, file)
		const fileURL = pathToFileURL(filePath).toString()
		const event = await import(fileURL)

		InterpretationManager.setListener(
			event.eventName,
			event.once,
			event.handler
		)
	}
}
