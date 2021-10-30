import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be an email format' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsNotEmpty({ message: 'Password confirm should not be empty' })
  @IsString({ message: 'Password confirm must be a string' })
  passwordConfirm: string;
}
