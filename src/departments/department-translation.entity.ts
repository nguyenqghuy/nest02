import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Language } from '../languages/language.entity';
import { Department } from './department.entity';

@Entity('department_translations')
@Unique(['language', 'department'])
export class DepartmentTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Language, (language) => language.code)
  language: Language;

  @ManyToOne(() => Department, (department) => department.translations)
  department: Department;
}
