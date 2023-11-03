import debugLib from 'debug'
const debug = debugLib('rg_bot:events:clientReady:log')
const error = debugLib('rg_bot:events:clientReady:error')

import { Events } from 'discord.js'

export const name = Events.ClientReady

export const once = true

export const execute = async (client) => {
	debug('Client ready!')
	if(!client.manager) return
	client.manager.init(client.user.id)
	debug(`Manager initialized with user id ${client.user.id}.`)
}
