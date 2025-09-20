import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
    

    @IsNotEmpty()
    @IsString()
    name: string;
    @IsString()
    job: string;
}
