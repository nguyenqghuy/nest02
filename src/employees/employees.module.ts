import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { LoggerService } from '../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee] )],
  controllers: [EmployeesController],
  providers: [EmployeesService, LoggerService]
})
export class EmployeesModule {}
