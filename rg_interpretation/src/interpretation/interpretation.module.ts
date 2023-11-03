import { Module } from '@nestjs/common'
import { InterpretationController } from './interpretation.controller'
import { InterpretationService } from './interpretation.service'

@Module({
	controllers: [InterpretationController],
	providers: [InterpretationService],
})
export class InterpretationModule {}
