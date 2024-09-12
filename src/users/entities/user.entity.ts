import { Wallet } from 'src/wallet/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Donation } from 'src/donations/entities/donation.entity';
import { Transaction } from 'src/wallet/entities/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  @JoinColumn()
  wallet: Wallet;

  @Column({ type: 'varchar', length: 60, nullable: true })
  transactionPin?: string; // Keeping as string to accommodate leading zeros

  @OneToMany(() => Donation, (donation) => donation.donor)
  donationsMade: Donation[];

  @OneToMany(() => Donation, (donation) => donation.beneficiary)
  donationsReceived: Donation[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // async setTransactionPin(pin: string): Promise<void> {
  //   const salt = await bcrypt.genSalt(10);
  //   this.transactionPin = await bcrypt.hash(pin, salt);
  // }

  // async validateTransactionPin(pin: string): Promise<boolean> {
  //   if (!this.transactionPin) {
  //     return false;
  //   }
  //   return await bcrypt.compare(pin, this.transactionPin);
  // }
}
