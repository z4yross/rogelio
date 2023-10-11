import debugLib from 'debug'

const debug = debugLib('rg_bot:music:event:nodeDestroy')
const error = debugLib('rg_bot:music:event:nodeDestroy:error')

import { Node, Manager } from 'magmastream'

export const state = 'nodeDestroy'

export const execute = async (node: Node, manager: Manager) => {
	// debug(`Node "${node.options.identifier}" destroyed.`)
}
