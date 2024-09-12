import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { BcryptService } from 'src/auth/hashing/bcrypt.service';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Transaction])],
  controllers: [WalletController],
  providers: [
    WalletService,
    UsersService,
    { provide: HashingService, useClass: BcryptService },
  ],
})
export class WalletModule {}
