import { IsString } from 'class-validator'

export class InterpretCreate {
	@IsString()
	text: string
}
