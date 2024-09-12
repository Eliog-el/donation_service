import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data-interfaces';
import { SetPinDto } from './dto/set-pin.dto';
import { VerifyPinDto } from './dto/verify-pin.dto';
import { Wallet } from './entities/wallet.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a wallet for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  async createWallet(
    @Param('userId') userId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    const wallet = await this.walletService.createWallet(user.sub);
    return wallet;
  }

  @Get()
  @ApiOperation({ summary: 'Get wallet details for a user by ID' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async getWallet(
    // @Param('userId') userId: string,
    @ActiveUser() user: ActiveUserData,
  ): Promise<Wallet> {
    return await this.walletService.getWallet(user.sub);
  }

  @Patch('fund-wallet')
  @ApiOperation({ summary: 'Update wallet balance' })
  fundWallet(
    // @Param('userId') userId: string,
    @ActiveUser() user: ActiveUserData,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    const { amount, pin } = updateWalletDto;
    console.log(amount, pin);
    return this.walletService.updateBalance(user.sub, amount, pin);
  }

  @Post('set-pin')
  @ApiOperation({ summary: 'Set transaction PIN for the authenticated user' })
  async setTransactionPin(
    @ActiveUser() user: ActiveUserData,
    @Body() setPinDto: SetPinDto, // Use DTO for validation
  ): Promise<{ message: string }> {
    const { pin, confirmPin } = setPinDto;

    if (pin !== confirmPin) {
      throw new BadRequestException('PINs do not match');
    }

    await this.walletService.setTransactionPin(user.sub, pin);

    return { message: 'Transaction PIN set successfully' };
  }

  @Post('verify-pin/:userId')
  @ApiOperation({
    summary: 'Verify transaction PIN for the authenticated user',
  })
  async verifyTransactionPin(
    @Param('userId') userId: string,
    @Body() verifyPinDto: VerifyPinDto,
  ): Promise<{ isValid: boolean }> {
    const isValid = await this.walletService.verifyTransactionPin(
      userId,
      verifyPinDto.pin,
    );
    return { isValid };
  }
}
