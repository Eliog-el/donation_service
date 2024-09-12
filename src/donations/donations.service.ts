import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { EmailSmsService } from 'src/notification/email-sms.service';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Transaction } from 'src/wallet/entities/transaction.entity';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    @InjectDataSource() private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private emailSmsService: EmailSmsService,
  ) {}

  // async createDonation(
  //   createDonationDto: CreateDonationDto,
  //   donorId: string,
  // ): Promise<Donation> {
  //   const { beneficiaryId, amount, message } = createDonationDto;

  //   const donor = await this.userRepository.findOne({
  //     where: { id: donorId },
  //     relations: ['wallet'],
  //   });

  //   if (!donor) throw new NotFoundException('Donor not found');

  //   const beneficiary = await this.userRepository.findOne({
  //     where: { id: beneficiaryId },
  //     relations: ['wallet'],
  //   });
  //   if (!beneficiary) throw new NotFoundException('Beneficiary not found');

  //   // Ensure donor has a wallet and sufficient balance
  //   if (!donor.wallet) throw new NotFoundException('Donor wallet not found');
  //   const donorWalletBalance = +donor.wallet.balance;
  //   if (donorWalletBalance < amount) {
  //     throw new BadRequestException('Insufficient wallet balance');
  //   }

  //   if (!beneficiary.wallet)
  //     throw new NotFoundException('Beneficiary wallet not found');

  //   donor.wallet.balance = donorWalletBalance - amount;
  //   await this.walletRepository.save(donor.wallet);

  //   const beneficiaryWalletBalance = +beneficiary.wallet.balance;
  //   beneficiary.wallet.balance = Number(
  //     (beneficiaryWalletBalance + amount).toFixed(2),
  //   ); // Convert back to number
  //   await this.walletRepository.save(beneficiary.wallet);

  //   const donation = this.donationRepository.create({
  //     amount,
  //     message,
  //     donor,
  //     beneficiary,
  //   });

  //   await this.donationRepository.save(donation);

  //   const totalDonations = await this.donationRepository.count({
  //     where: { donor: donor },
  //   });

  //   if (totalDonations >= 2) {
  //     await this.sendThankYouMessage(donor);
  //   }

  //   return donation;
  // }

  async createDonation(
    createDonationDto: CreateDonationDto,
    donorId: string,
  ): Promise<Donation> {
    const { beneficiaryId, amount, message } = createDonationDto;

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      // Fetch donor and beneficiary with their wallets
      const donor = await manager.findOne(User, {
        where: { id: donorId },
        relations: ['wallet'],
      });
      if (!donor) throw new NotFoundException('Donor not found');

      const beneficiary = await manager.findOne(User, {
        where: { id: beneficiaryId },
        relations: ['wallet'],
      });
      if (!beneficiary) throw new NotFoundException('Beneficiary not found');

      // Ensure donor has a wallet and sufficient balance
      if (!donor.wallet) throw new NotFoundException('Donor wallet not found');
      const donorWalletBalance = +donor.wallet.balance;
      if (donorWalletBalance < amount) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      // Ensure beneficiary has a wallet
      if (!beneficiary.wallet)
        throw new NotFoundException('Beneficiary wallet not found');

      // Deduct amount from donor's wallet
      donor.wallet.balance = parseFloat(
        (donorWalletBalance - amount).toFixed(2),
      );
      await manager.save(donor.wallet);

      // Add amount to beneficiary's wallet
      beneficiary.wallet.balance = +beneficiary.wallet.balance + amount;

      await manager.save(beneficiary.wallet);

      // Create and save the donor's transaction record
      const donorTransaction = new Transaction();
      donorTransaction.amount = amount;
      donorTransaction.type = 'debit';
      donorTransaction.wallet = donor.wallet;
      donorTransaction.user = donor;
      await manager.save(donorTransaction);

      // Create and save the beneficiary's transaction record
      const beneficiaryTransaction = new Transaction();
      beneficiaryTransaction.amount = amount;
      beneficiaryTransaction.type = 'credit';
      beneficiaryTransaction.wallet = beneficiary.wallet;
      beneficiaryTransaction.user = beneficiary;
      await manager.save(beneficiaryTransaction);

      // Create and save the donation record
      const donation = this.donationRepository.create({
        amount,
        message,
        donor,
        beneficiary,
      });
      await manager.save(donation);

      // // Check if the donor has made more than one donation and send a thank-you message
      // const totalDonations = await manager.count(Donation, {
      //   where: { donor: donor },
      // });
      // Count the number of donations made by the donor
      const totalDonations = await manager.count(Donation, {
        where: { donor: { id: donorId } } as FindOptionsWhere<Donation>, // Adjust the query format
      });

      if (totalDonations >= 2) {
        await this.sendThankYouMessage(donor);
      }

      return donation;
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<Donation[]> {
    const { page = 1, limit = 10 } = paginationDto;

    return this.donationRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['donor', 'beneficiary'],
    });
  }

  async findOne(id: number) {
    const donation = await this.donationRepository.findOne({
      where: { id },
      relations: ['donor', 'beneficiary'],
    });
    if (!donation) throw new NotFoundException('Donation not found');
    return donation;
  }

  async findByUser(userId: string): Promise<Donation[]> {
    return this.donationRepository.find({
      where: { donor: { id: userId } },
      relations: ['donor', 'beneficiary'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }

  private async sendThankYouMessage(user: User): Promise<void> {
    const message =
      'Thank you for your generous donations! We appreciate your support.';

    if (user.email) {
      await this.emailSmsService.sendEmail(
        user.email,
        'Thank You for Your Donations',
        message,
      );
    }

    if (user.phoneNumber) {
      await this.emailSmsService.sendSms(user.phoneNumber, message);
    }
  }
}
