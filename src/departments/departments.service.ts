import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { DepartmentTranslation } from './department-translation.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({ relations: ['translations', 'translations.language'] });
  }

  async findOne(id: number): Promise<Department | null> {
    return this.departmentRepository.findOne({ where: { id }, relations: ['translations', 'translations.language'] });
  }

  async create(department: { location: string, translations: { languageCode: string, name: string, description: string }[] }): Promise<Department | { error: string }> {
    if (department) {
      const newDepartment = this.departmentRepository.create({ location: department.location });
      await this.departmentRepository.save(newDepartment);

      if (department.translations) {
        newDepartment.translations = department.translations.map((translation) =>
          this.departmentRepository.manager.create(DepartmentTranslation, {
            language: { code: translation.languageCode },
            name: translation.name,
            description: translation.description,
            department: { id: newDepartment.id },
          }),
        );
        await this.departmentRepository.manager.save(newDepartment.translations);
      }

      return newDepartment;
    }
    return { error: 'Invalid department data' };
  }

  async update(id: number, department: { location: string, translations: { languageCode: string, name: string, description: string }[] }): Promise<Department | { error: string }> {
    const existing = await this.departmentRepository.findOne({ where: { id }, relations: ['translations', 'translations.language'] });
    if (!existing) {
      return { error: 'Department not found' };
    }

    existing.location = department.location;
    // Update translations
    if (department.translations) {
      department.translations.map((translation) => {
        const existingTranslation = existing.translations.find(t => t.language.code === translation.languageCode);
        if (existingTranslation) {
            console.log(`updating translation for language ${translation.languageCode}`);
          existingTranslation.name = translation.name;
          existingTranslation.description = translation.description;
        } else {
            console.log(`adding new translation for language ${translation.languageCode}`);
            existing.translations.push(this.departmentRepository.manager.create(DepartmentTranslation, {
            language: { code: translation.languageCode },
            name: translation.name,
            description: translation.description,
            department: { id: existing.id },
          }));
        }
      });
    }

    await this.departmentRepository.save(existing);
    await this.departmentRepository.manager.save(existing.translations);
    return existing;
  }

  async delete(id: number): Promise<{ message: string } | { error: string }> {
    const existing = await this.departmentRepository.findOne({ where: { id }, relations: ['translations'] });
    if (!existing) {
      return { error: 'Department not found' };
    }
    //check employee with this department
    const employees = await this.departmentRepository.manager.getRepository('Employee').find({ where: { department: { id } } });
    if (employees.length > 0) {
        return { error: 'Cannot delete department with associated employees' };
    }
    //remove translations first
    try{
        await this.departmentRepository.manager.remove(existing.translations);
        const result = await this.departmentRepository.delete(id);
    } catch (error) {
        return { error: 'Error deleting department translations' };
    }
    console.log(`Department ${id} deleted.`);
    return { message: `Department ${id} deleted.` };
  }
}
