import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { LoggerService } from '../logger/logger.service';
import { EmployeeTranslation } from './employee-translation.entity';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      relations: ['translations', 'translations.language'],
    });
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOneBy({ id });
  }

  async create(employee: { name: string, address: string, translations: { languageCode: string, job: string }[] }): Promise<Employee | { error: string }> {
    if (employee && employee.name) {
      const newEmployee = this.employeeRepository.create({ name: employee.name, address: employee.address });
      await this.employeeRepository.save(newEmployee);

      if (employee.translations) {
        const translations = employee.translations.map((translation) =>
           this.employeeRepository.manager.create(EmployeeTranslation, {
            language: { code: translation.languageCode },
            job: translation.job,
            employee: {id: newEmployee.id},
          })
        );
        // console.log(`translation: id ${translations[0].id}  job: ${translations[0].job}`);
        await this.employeeRepository.manager.save(translations);
        newEmployee.translations = translations;
      }

      this.logger.log(`Employee ${employee.name} created with translations.`);
      
      return newEmployee;
    }
    return { error: 'Invalid employee data' };
  }

  async update(id: number, employee: { name: string, address: string, translations: { languageCode: string, job: string }[] }): Promise<Employee | { error: string } | EmployeeTranslation[]> {
    const existing = await this.employeeRepository.findOne({ where: { id }, relations: ['translations', 'translations.language'] });
    if (!existing) {
      return { error: 'Employee not found' };
    }

    existing.name = employee.name;
    existing.address = employee.address;

    // Update translations
    if (employee.translations) {
      employee.translations.map((translation) => {
        const existingTranslation = existing.translations.find(t => t.language.code === translation.languageCode);
        if (existingTranslation) {
          existingTranslation.job = translation.job;
          // return existingTranslation;
        } else {
          existing.translations.push(this.employeeRepository.manager.create(EmployeeTranslation, {
            language: { code: translation.languageCode },
            job: translation.job,
            employee: {id: existing.id},
          }));
        }
      });
    }
    
    await this.employeeRepository.save(existing);
    await this.employeeRepository.manager.save(existing.translations);
    this.logger.log(`Employee ${id} and translations updated.`);
    return existing.translations;
  }

  async remove(id: number): Promise<{ message: string } | { error: string }> {
    const existing = await this.employeeRepository.findOne({ where: { id }, relations: ['translations'] });
    if (!existing) {
      return { error: 'Employee not found' };
    }
    try{
      await this.employeeRepository.manager.remove(existing.translations);
      
      const result = await this.employeeRepository.delete(id);
    }catch(error){
      return { error: 'Error deleting employee or translations' };
    }
    // const result = await this.employeeRepository.delete(id);
    // if (result.affected === 0) {
    //   return { error: 'Employee not found' };
    // }
    this.logger.log(`Employee ${id} deleted.`);
    return { message: `Employee ${id} deleted.` };
  }
}
