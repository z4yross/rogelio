import { Test, TestingModule } from '@nestjs/testing'
import { InterpretationService } from './interpretation.service'

describe('InterpretationService', () => {
	let service: InterpretationService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InterpretationService],
		}).compile()

		service = module.get<InterpretationService>(InterpretationService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
