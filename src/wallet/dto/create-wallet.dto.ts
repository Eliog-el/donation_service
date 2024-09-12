import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    description: 'The initial amount to be set in the wallet.',
    example: 100,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description:
      'The transaction PIN for the wallet. Must be between 4 and 6 characters long.',
    example: '1234',
  })
  @IsString()
  @Length(4, 6) // Adjust the length according to your PIN requirements
  pin: string;
}
