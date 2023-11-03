import debugLib from 'debug'
const debug = debugLib('rg_bot:music:player')
const error = debugLib('rg_bot:music:player:error')

import { Manager, ManagerOptions } from 'magmastream'
import { CommandInteraction, GuildMember } from 'discord.js'

export interface Command {
	name: string

	execute(
		interaction: CommandInteraction,
		playerManager: RogelioPlayerManager,
		args: any
	): Promise<string>
}

export interface ManagerEvent {
	state: string
	once?: boolean
	execute: (...args: any[]) => void
}

export class RogelioPlayerManager extends Manager {
	private commands: Map<string, Command>

	constructor(managerOptions: ManagerOptions) {
		super(managerOptions)
	}

	async getGuildPlayer(interaction: CommandInteraction, create = false) {
		let player = this.get(interaction.guildId)
		if (!player && create) player = await this.connect(interaction)
		return player
	}

	async connect(interaction: CommandInteraction) {
		const member = interaction.member as GuildMember

		const player = this.create({
			guild: interaction.guildId,
			voiceChannel: member.voice.channel.id,
			textChannel: interaction.channel.id,
			selfDeafen: true,
			selfMute: false,
			volume: 100,
		})

		player.connect()
		return player
	}

	async executeCommand(
		name: string,
		interaction: CommandInteraction,
		args: any
	): Promise<string> {
		const command = this.commands.get(name)
		console.log(command)
		if (!command) throw new Error('Command not found.')
		try {
			return await command.execute(interaction, this, args)
		} catch (err) {
			error(err)
			throw err
		}
	}

	async addCommand(command: Command) {
		if (!this.commands) this.commands = new Map()
		debug(`Adding command ${command.name}`)
		this.commands.set(command.name, command)
	}

	async addEvent(event: ManagerEvent) {
		if (event.once)
			this.once(event.state, (...args) => event.execute(...args, this))
		else this.on('nodeCreate', (...args) => event.execute(...args, this))
	}
}
