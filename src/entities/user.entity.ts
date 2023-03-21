import { InternalServerErrorException } from '@nestjs/common';
import { Exclude, instanceToPlain } from 'class-transformer';
import { nanoid } from 'nanoid';
import { BCryptHelper } from 'src/utils/hash.helper';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: 'lorem-ipsum' })
  signature: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @Column()
  name: string;

  @Column({
    nullable: true,
    default:
      'https://cdn.iconfinder.com/data/icons/music-ui-solid-24px/24/user_account_profile-2-256.png',
  })
  picture: string;

  @Column({ name: 'sex_type', nullable: true, default: 'Other' })
  sexType: string;

  @Column({ type: 'date', nullable: true })
  birthdate: string;

  @Column({ nullable: true })
  telephone: string;

  @BeforeInsert()
  async handleBeforeInsert() {
    const bCryptHelper = new BCryptHelper();
    try {
      this.signature = nanoid(8);
      this.password = await bCryptHelper.hashPassword(this.password);
    } catch (err) {
      throw new InternalServerErrorException('There are some issue before inserting');
    }
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
