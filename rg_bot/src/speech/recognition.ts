import debugLib from 'debug'
const debug = debugLib('rg_bot:speech:recognition')
const error = debugLib('rg_bot:speech:recognition:error')

const VOSK_SERVER = process.env.VOSK_SERVER || 'localhost'
const VOSK_PORT = process.env.VOSK_PORT || 2700

import fs from 'fs'
import path from 'path'

// import * as vosk from 'vosk'
import * as prism from 'prism-media'
import { AudioReceiveStream } from '@discordjs/voice'

import WebSocket, { RawData } from 'ws'
import { GuildMember } from 'discord.js'

// vosk.setLogLevel(-1)

export class Recognition {
	isReady = false
	// model: vosk.Model

	ws: WebSocket

	constructor(
		private rate: number,
		private user: GuildMember
	) {
		this.init()
	}

	handleMessage(data: RawData) {
		if (!data) return

		const parsed = JSON.parse(data.toString())
		if (!parsed) return

		if (!parsed.text) return

		const result = {
			text: parsed.text,
			user: this.user.nickname || this.user.user.username,
		}

		debug(result)
	}

	private init() {
		debug('Initializing speech recognition...')

		this.ws = new WebSocket(`ws://${VOSK_SERVER}:${VOSK_PORT}`)

		this.ws.on('message', (data) => this.handleMessage(data))

		this.ws.on('open', () => {
			debug('Connected to server.')

			const config = {
				config: {
					sample_rate: this.rate,
				},
			}

			this.ws.send(JSON.stringify(config))
		})

		this.ws.on('close', () => {
			debug('Connection closed.')
		})

		this.ws.on('error', (err) => {
			error(err)
		})

		this.isReady = true
	}

	public recognize(stream: AudioReceiveStream, decoder: prism.opus.Decoder) {
		if (!this.isReady) {
			error('Speech recognition is not ready.')
			return
		}

		decoder.on('data', (data) => {
			if (!data) return

			const buffer = Buffer.from(data)
			if (!buffer || buffer.length === 0) return

			if (this.ws.readyState !== WebSocket.OPEN) return

			this.ws.send(buffer)
		})

		decoder.on('close', () => {
			if (this.ws.readyState !== WebSocket.OPEN) return
			this.ws.send('{"eof" : 1}')
			debug('Recognizing ended.')
		})

		stream.pipe(decoder)
		debug('Recognizing...')
	}
}
