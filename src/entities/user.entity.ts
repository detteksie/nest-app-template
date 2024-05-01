import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, instanceToPlain } from 'class-transformer';
import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hashPassword } from '~/utils/bcrypt.util';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Exclude()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ default: 'lorem-ipsum' })
  signature: string;

  @ApiProperty()
  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({
    nullable: true,
    default:
      'https://cdn.iconfinder.com/data/icons/music-ui-solid-24px/24/user_account_profile-2-256.png',
  })
  picture: string;

  @ApiProperty()
  @Column({
    name: 'sex_type',
    nullable: true,
    default: 'Unknown',
    enum: ['Unknown', 'Male', 'Female', 'Other'],
    type: 'enum',
  })
  sexType: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  birthdate: string;

  @ApiProperty()
  @Column({ nullable: true })
  telephone: string;

  @BeforeInsert()
  async handleBeforeInsert() {
    try {
      this.signature = nanoid(8);
      this.password = await hashPassword(this.password);
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
