import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class AuthDto {
  @IsOptional()
  @IsString()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  fileName: string;
}
