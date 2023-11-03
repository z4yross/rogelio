import { Body, Controller, Post } from '@nestjs/common'
import { InterpretCreate } from './dto/interpret.create'
import { InterpretationService } from './interpretation.service'

@Controller('interpretation')
export class InterpretationController {

	constructor(
		private readonly interpretationService: InterpretationService
	) { }

	@Post()
	async interpret(@Body() body: InterpretCreate) {
		return this.interpretationService.interpret(body.text)
	}
}
