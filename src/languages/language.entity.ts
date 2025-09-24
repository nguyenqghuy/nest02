import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('languages')
export class Language {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;
}
