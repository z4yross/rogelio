import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'

import { prompt, examples } from './prompts/main.prompt'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat/completions'
import { Interpretation } from './types/interpreation'

@Injectable()
export class InterpretationService {
	private openai: OpenAI

	constructor() {
		this.openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		})
	}

	async interpret(text: string): Promise<Interpretation> {
		let options: ChatCompletionCreateParamsNonStreaming = {
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: prompt },
				...examples,
				{ role: 'user', content: text },
			],
		}

		const completion = await this.openai.chat.completions.create(options)
		const assistant = completion.choices[0].message.content

		if (!assistant) return null

		const interpretation: Interpretation = JSON.parse(assistant)
		return interpretation
	}
}
