import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
