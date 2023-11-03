import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { InterpretationModule } from './interpretation/interpretation.module'

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), InterpretationModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
