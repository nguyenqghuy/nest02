import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOneBy({ id });
  }

  async create(employee: { name: string, job: string }): Promise<Employee | { error: string }> {
    if (employee && employee.name) {
      const newEmployee = this.employeeRepository.create({ name: employee.name, job: employee.job });
      await this.employeeRepository.save(newEmployee);
      this.logger.log(`Employee ${employee.name} created.`);
      return newEmployee;
    }
    return { error: 'Invalid employee data' };
  }

  async update(id: number, employee: { name: string, job: string }): Promise<Employee | { error: string }> {
    const existing = await this.employeeRepository.findOneBy({ id });
    if (!existing) {
      return { error: 'Employee not found' };
    }
    existing.name = employee.name;
    existing.job = employee.job;
    await this.employeeRepository.save(existing);
    this.logger.log(`Employee ${id} updated.`);
    return existing;
  }

  async remove(id: number): Promise<{ message: string } | { error: string }> {
    const result = await this.employeeRepository.delete(id);
    if (result.affected === 0) {
      return { error: 'Employee not found' };
    }
    this.logger.log(`Employee ${id} deleted.`);
    return { message: `Employee ${id} deleted.` };
  }
}
