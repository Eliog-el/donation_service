import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Donation } from './entities/donation.entity';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data-interfaces';

@ApiTags('donations')
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a donation' })
  @ApiParam({ name: 'donorId', description: 'ID of the donor' })
  @ApiResponse({ status: 201, description: 'Donation created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or validation error' })
  create(
    @Body() createDonationDto: CreateDonationDto,
    // @Param('donorId') donorId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.donationsService.createDonation(createDonationDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all donations with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiResponse({ status: 200, description: 'List of donations' })
  async findAll(@Query() paginationDto: PaginationDto): Promise<Donation[]> {
    return this.donationsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single donation by ID' })
  @ApiParam({ name: 'id', description: 'ID of the donation' })
  @ApiResponse({ status: 200, description: 'Donation details' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  async findOne(@Param('id') id: number): Promise<Donation> {
    return this.donationsService.findOne(id);
  }

  @Get('/users/donations')
  @ApiOperation({ summary: 'Get all donations by a specific user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'List of donations made by the user',
  })
  async findByUser(@ActiveUser() user: ActiveUserData): Promise<Donation[]> {
    return this.donationsService.findByUser(user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a donation by ID' })
  @ApiParam({ name: 'id', description: 'ID of the donation' })
  @ApiResponse({ status: 200, description: 'Donation deleted' })
  @ApiResponse({ status: 404, description: 'Donation not found' })
  remove(@Param('id') id: string) {
    return this.donationsService.remove(+id);
  }
}
