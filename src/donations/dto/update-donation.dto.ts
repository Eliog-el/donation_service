import { PartialType } from '@nestjs/mapped-types';
import { CreateDonationDto } from './create-donation.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDonationDto extends PartialType(CreateDonationDto) {
  @ApiPropertyOptional({
    description: 'Optional new amount for the donation.',
    example: 100,
  })
  amount?: number;

  @ApiPropertyOptional({
    description: 'Optional new message for the donation.',
    example: 'Updated message',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Optional new beneficiary ID for the donation.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  beneficiaryId?: string;
}
