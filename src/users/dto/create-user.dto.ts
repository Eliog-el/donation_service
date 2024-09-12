import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'example@example.com',
  })
  email: string;

  @MinLength(10)
  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;

  @IsPhoneNumber()
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+2348126294322',
  })
  phoneNumber: string;

  @IsAlpha()
  @MinLength(2)
  @ApiProperty({ description: 'The firstName of the user', example: 'John' })
  firstName: string;

  @IsAlpha()
  @MinLength(2)
  @ApiProperty({ description: 'The lastName of the user', example: 'Doe' })
  lastName: string;
}
