import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'The page number for pagination.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'The number of items per page for pagination.',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
