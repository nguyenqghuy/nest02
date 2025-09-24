import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  translations: { languageCode: string; name: string; description: string }[];
}