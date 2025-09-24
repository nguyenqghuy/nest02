import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { EmployeeTranslation } from './employee-translation.entity';
import { Department } from '../departments/department.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne(() => Department, (department) => department.id)
  department: Department;

  @OneToMany(() => EmployeeTranslation, (translation) => translation.employee)
  translations: EmployeeTranslation[];
}
