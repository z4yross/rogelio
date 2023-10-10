import debugLib from 'debug'

const debug = debugLib('rg_bot:music:event:nodeConnect')
const error = debugLib('rg_bot:music:event:nodeConnect:error')

import { Node, Manager } from 'magmastream'

export const state = 'nodeConnect'

export const execute = async (
	node: Node,
	manager: Manager
) => {
	debug(`Node "${node.options.identifier}" connected.`)
}
