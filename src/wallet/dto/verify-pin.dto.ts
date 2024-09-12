import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyPinDto {
  @ApiProperty({
    description:
      'The transaction PIN to be verified. Must be between 4 and 6 characters long.',
    example: '1234',
  })
  @IsString()
  @Length(4, 6) // Assuming PINs are 4 to 6 digits
  pin: string;
}
