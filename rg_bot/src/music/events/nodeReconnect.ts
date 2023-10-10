import debugLib from 'debug'

const debug = debugLib('rg_bot:music:event:nodeReconnect')
const error = debugLib('rg_bot:music:event:nodeReconnect:error')

import { Node, Manager } from 'magmastream'

export const state = 'nodeReconnect'

export const execute = async (
	node: Node,
	manager: Manager
) => {
	// debug(`Node "${node.options.identifier}" reconnected.`)
}
