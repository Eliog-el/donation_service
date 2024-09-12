// src/wallet/entities/transaction.entity.ts

import { User } from 'src/users/entities/user.entity';
import { Wallet } from './wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: string; // 'credit', 'debit', etc.

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
