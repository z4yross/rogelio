import debugLib from 'debug'
const debug = debugLib('rg_bot:events:clientReady:log')
const error = debugLib('rg_bot:events:clientReady:error')

import { Client, Events } from 'discord.js'

export const name = Events.InteractionCreate

export const execute = async (client: Client, interaction) => {
	if (!interaction.isChatInputCommand()) return

	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) return

	try {
		await command.execute(interaction)
	} catch (err) {
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			})
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			})
		}
	}
}
