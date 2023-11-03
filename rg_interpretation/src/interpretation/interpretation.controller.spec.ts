import { Test, TestingModule } from '@nestjs/testing'
import { InterpretationController } from './interpretation.controller'

describe('InterpretationController', () => {
	let controller: InterpretationController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [InterpretationController],
		}).compile()

		controller = module.get<InterpretationController>(
			InterpretationController
		)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
