import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:play')
const error = debugLib('rg_bot:commands:play:error')

import {
	SlashCommandBuilder,
	CommandInteraction,
	GuildMember,
} from 'discord.js'
import { RogelioClient } from '../../client/RogelioClient.js'
import { SearchResult } from 'magmastream'

export const data = new SlashCommandBuilder()
	.setName('play')
	.setDescription('Plays a song.')
	.addStringOption((option) =>
		option
			.setName('song')
			.setDescription('The song to play.')
			.setRequired(true)
	)

export async function execute(interaction: CommandInteraction) {
	const client = interaction.client as RogelioClient
	const musciClient = client.musicClient
	const manager = musciClient.manager
	const member = interaction.member as GuildMember

	if (!member.voice || !member.voice.channel) {
		await interaction.reply({
			content: 'You must be in a voice channel to use this command.',
			ephemeral: true,
		})
		return
	}

	const search = interaction.options.get('song').value as string

	let res: SearchResult

	try {
		res = await manager.search(search)

		if (res.loadType === 'empty') throw { message: 'No results found.' }
		if (res.loadType === 'playlist') {
			throw { message: 'Playlists are not supported with this command.' }
		}
	} catch (err) {
		error(err)
		await interaction.reply(
			`there was an error while searching: ${err.message}`
		)
		return
	}

	if (res.loadType === 'error') {
		await interaction.reply('there was no tracks found with that query.')
		return
	}

	let player = manager.get(interaction.guildId)

	if (player === undefined) {
		player = manager.create({
			guild: interaction.guild.id,
			voiceChannel: member.voice.channel.id,
			textChannel: interaction.channel.id,
			selfDeafen: false,
			selfMute: false,
			volume: 100,
		})

		player.connect()
	}

	player.queue.add(res.tracks[0])

	if (!player.playing && !player.paused && !player.queue.size) {
		player.play()
		await interaction.reply(`playing ${res.tracks[0].title}.`)
		return
	}
	
	await interaction.reply(`enqueuing ${res.tracks[0].title}.`)
}
