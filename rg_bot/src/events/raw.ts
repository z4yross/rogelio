import debugLib from 'debug'
const debug = debugLib('rg_bot:events:clientReady:log')
const error = debugLib('rg_bot:events:clientReady:error')

import { Client } from 'discord.js'

export const name = 'raw'

export const once = false

export const execute = async (client: any, interaction: any) => {
	client.manager.updateVoiceState(interaction)
}
