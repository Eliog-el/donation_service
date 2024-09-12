import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SetPinDto {
  @ApiProperty({
    description:
      'The transaction PIN to be set for the wallet. Must be between 4 and 6 characters long.',
    example: '1234',
  })
  @IsString()
  @Length(4, 6) // Adjust length according to your requirements
  pin: string;

  @ApiProperty({
    description:
      'The transaction PIN to be set for the wallet. Must be between 4 and 6 characters long.',
    example: '1234',
  })
  @IsString()
  @Length(4, 6) // Adjust length according to your requirements
  confirmPin: string;
}
