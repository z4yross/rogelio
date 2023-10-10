import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:ping')
const error = debugLib('rg_bot:commands:ping:error')

import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong!')

export async function execute (interaction: CommandInteraction) {
	try {
		await interaction.reply('Pong!')
	} catch (err) {
		error(err)
	}
}

// interactionOrMessage: CommandInteraction | Message, arguments?: string
