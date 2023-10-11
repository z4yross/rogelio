import debugLib from 'debug'
const debug = debugLib('rg_bot:commands:play')
const error = debugLib('rg_bot:commands:play:error')

import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

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
	// @ts-ignore
	if (!interaction.member.voice || !interaction.member.voice.channel) {
		await interaction.reply({
			content: 'You must be in a voice channel to use this command.',
			ephemeral: true,
		})
		return
	}

	// @ts-ignore
	const search = interaction.options.getString('song')
	let res

	try {
		// @ts-ignore
		res = await interaction.client.manager.search(search)
		// Check the load type as this command is not that advanced for basics
		if (res.loadType === 'empty') throw res.exception
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

	// @ts-ignore
	const player = interaction.client.manager.create({
		guild: interaction.guild.id,
		// @ts-ignore
		voiceChannel: interaction.member.voice.channel.id,
		textChannel: interaction.channel.id,
		selfDeafen: false,
		selfMute: false,
		volume: 100,
	})

	player.connect()
	player.queue.add(res.tracks[0])
	// player.play()

	if (!player.playing && !player.paused && !player.queue.size) {
		player.play()
		await interaction.reply(`playing ${res.tracks[0].title}.`)
		return
	}
	await interaction.reply(`enqueuing ${res.tracks[0].title}.`)
}

// interactionOrMessage: CommandInteraction | Message, arguments?: string
