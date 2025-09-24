import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';
import { Language } from './language.entity';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [LanguagesController],
  providers: [LanguagesService, LoggerService],
})
export class LanguagesModule {}
