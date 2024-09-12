import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity';
import { User } from 'src/users/entities/user.entity';
import { EmailSmsService } from 'src/notification/email-sms.service';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donation, User, Wallet]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'elijahogunrinade@gmail.com',
          pass: 'rKWUZ8T!iyekEV_',
        },
      },
    }),
  ],
  controllers: [DonationsController],
  providers: [DonationsService, EmailSmsService],
})
export class DonationsModule {}
