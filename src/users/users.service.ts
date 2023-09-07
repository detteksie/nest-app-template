import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { IPaginationOptions, paginate } from 'src/utils/torm-paginate';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getUserList(options: IPaginationOptions) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const queryBuilder = queryRunner.manager.createQueryBuilder(User, 'u');
      return paginate<User>(queryBuilder, options);
    } finally {
      await queryRunner.release();
    }
  }

  async getUserByUsername(username: string) {
    // const userQuery = this.dataSource.createQueryBuilder(User, 'user');
    // const user = await userQuery.where('username = :username', { username }).getOne();
    const user = await this.userRepository.findOne({ where: { username } });
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
