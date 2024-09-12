import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({
    description: 'The amount of the donation. Must be a positive number.',
    example: 100,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'A message associated with the donation.',
    example: 'Donation support!',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The UUID of the beneficiary receiving the donation.',
    example: 'd9b2d63d-a1f1-4c88-8b12-0d7d9d220a8f',
  })
  @IsUUID()
  beneficiaryId: string;
}
