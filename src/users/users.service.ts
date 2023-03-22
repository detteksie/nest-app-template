import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUserByUsername(username: string) {
    const userQuery = this.dataSource.createQueryBuilder(User, 'user');
    const user = await userQuery.where('username = :username', { username }).getOne();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserDetail(userId: number) {
    const userQuery = this.dataSource.createQueryBuilder(User, 'user');
    const user = userQuery.where('id = :userId', { userId }).getOne();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
