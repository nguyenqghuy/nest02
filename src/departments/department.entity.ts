import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DepartmentTranslation } from './department-translation.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @OneToMany(() => DepartmentTranslation, (translation) => translation.department)
  translations: DepartmentTranslation[];
}
