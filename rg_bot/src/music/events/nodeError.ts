import debugLib from 'debug'

const debug = debugLib('rg_bot:music:event:nodeError')
const error = debugLib('rg_bot:music:event:nodeError:error')

import { Node, Manager } from 'magmastream'

export const state = 'nodeError'

export const execute = async (node: Node, err: Error, manager: Manager) => {
	debug(
		`Node "${node.options.identifier}" encountered an error: ${err.message}.`
	)
}
