import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsArray()
  translations: { languageCode: string; job: string }[];
}
