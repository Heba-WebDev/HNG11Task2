import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(1)
  readonly firstName: string;

  @IsString()
  @MinLength(1)
  readonly lastName: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;
}
