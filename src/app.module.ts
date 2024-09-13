import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { DonationsModule } from './donations/donations.module';
import { User } from './users/entities/user.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { Donation } from './donations/entities/donation.entity';
import { EmailSmsService } from './notification/email-sms.service';
import { ConfigModule } from '@nestjs/config';
import { Transaction } from './wallet/entities/transaction.entity';
import { EnvService } from './common/env.service';

const config = new EnvService().read();

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.DB_HOST,
      port: config.DB_PORT,
      username: config.DB_USERNAME,
      password: '',
      database: config.DB_NAME,
      entities: [User, Wallet, Donation, Transaction],
      autoLoadEntities: true,
      synchronize: true,
      // dropSchema: true,
    }),
    UsersModule,
    AuthModule,
    WalletModule,
    DonationsModule,
  ],
  controllers: [],
  providers: [EmailSmsService],
})
export class AppModule {}
