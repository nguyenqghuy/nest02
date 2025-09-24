import { Entity, Column, ManyToOne, Unique, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from '../languages/language.entity';
import { Employee } from './employee.entity';

@Entity('employee_translations')
@Unique(['language', 'employee'])
export class EmployeeTranslation {
    @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => Language, (language) => language.code)
  language: Language;

  @ManyToOne(() => Employee, (employee) => employee.translations)
  employee: Employee;

  @Column()
  job: string;
}
