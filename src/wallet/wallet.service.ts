import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data-interfaces';
import { UsersService } from 'src/users/users.service';
import { Wallet } from './entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
  ) {}

  async createWallet(userId: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(userId);

      if (user.wallet) {
        throw new UnauthorizedException('Wallet already exist');
      }
      // const wallet = new Wallet();
      // wallet.balance = 100.0; // Set the initial balance
      // user.wallet = wallet;

      const wallet = this.walletRepository.create({
        balance: 100.0, // Set initial balance
        user: user, // Set the user relationship
      });

      // const savedWallet = await this.walletRepository.save(wallet);

      // console.log(wallet);
      const savedWallet = await this.walletRepository.save(wallet);

      delete savedWallet.user.password, savedWallet.user.transactionPin;

      console.log('llll');

      user.wallet = savedWallet;
      console.log('pppp-----');
      return await this.usersService.save(user);
    } catch (err) {
      const uniqueViolationErrorCode = 'ER_DUP_ENTRY'; // Adjust based on your database type
      if (err.code === uniqueViolationErrorCode) {
        throw new ConflictException('Wallet creation conflict');
      }

      // Rethrow other errors to be caught by the controller
      throw err;
    }
  }

  async getWallet(userId: string): Promise<Wallet> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wallet'],
    });
    if (!user) throw new NotFoundException('User not found');

    if (!user.wallet) throw new NotFoundException('Wallet not found');

    return user.wallet;
  }

  async updateBalance(
    userId: string,
    amount: number,
    pin: string,
  ): Promise<Wallet> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wallet'],
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.transactionPin) {
      throw new NotFoundException('Set pin');
    }

    // Verify transaction PIN
    const isPinValid = await this.hashingService.compare(
      pin,
      user.transactionPin,
    );

    if (!isPinValid) throw new UnauthorizedException('Invalid transaction PIN');

    // Update wallet balance logic
    if (!user.wallet) throw new NotFoundException('Wallet not found');

    console.log('------=======---', user);

    // const currentBalance = parseFloat(+user.wallet.balance);

    // user.wallet.balance = (currentBalance + amount).toFixed(2);
    console.log(user.wallet.balance, amount);
    user.wallet.balance = +user.wallet.balance + amount;
    await this.userRepository.save(user);

    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.type = amount > 0 ? 'credit' : 'debit';
    transaction.wallet = user.wallet;
    transaction.user = user;

    await this.transactionRepository.save(transaction);

    return user.wallet;
  }

  async setTransactionPin(userId: string, pin: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.transactionPin = await this.hashingService.hash(pin);
    await this.userRepository.save(user);
  }

  async verifyTransactionPin(userId: string, pin: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.transactionPin) return false;

    return this.hashingService.compare(pin, user.transactionPin);
  }
}
