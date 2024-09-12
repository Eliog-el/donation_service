// src/donations/entities/donation.entity.ts

import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.donationsMade)
  donor: User;

  @ManyToOne(() => User, (user) => user.donationsReceived)
  beneficiary: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
