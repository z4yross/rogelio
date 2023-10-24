import {
	SlashCommandBuilder,
	Client,
	ClientOptions,
	Collection,
} from 'discord.js'
import { Manager } from 'magmastream'

export interface ClientEvent {
	name: string
	once?: boolean
	execute: (...args: any[]) => void
}

export interface ClientCommand {
	data: SlashCommandBuilder
	execute: (...args: any[]) => void
}

export class ClientWithManager extends Client {
	manager: Manager

	constructor(options: ClientOptions) {
		super(options)
	}
}

export class RogelioClient extends Client {
	musicClient: ClientWithManager
	commands: Collection<string, any>

	constructor(options: ClientOptions) {
		super(options)
	}

	addMusicClient(options: ClientOptions): RogelioClient {
		this.musicClient = new ClientWithManager(options)
		return this
	}

	addManager(manager: Manager): RogelioClient {
		this.musicClient.manager = manager
		return this
	}

	addCommand(command: ClientCommand): RogelioClient {
		this.commands.set(command.data.name, command)
		return this
	}

	addEvent(event: ClientEvent): RogelioClient {
		if (event.once) {
			this.once(event.name, (...args) => event.execute(this, ...args))
			this.musicClient.once(event.name, (...args) =>
				event.execute(this.musicClient, ...args)
			)
		} else {
			this.on(event.name, (...args) => event.execute(this, ...args))
			this.musicClient.on(event.name, (...args) =>
				event.execute(this.musicClient, ...args)
			)
		}
		return this
	}

	async commit(mainToken: string, musicToken: string) {
		await this.musicClient.login(musicToken)
		await super.login(mainToken)
	}
}
