import { IPaginationOptions, paginate } from '@app/typeorm-paginate';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '~/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(body: CreateUserDto) {
    const userDto = this.usersRepository.create({
      email: body.email.toLowerCase(),
      username: body.username.toLowerCase(),
      name: body.name,
      password: body.password,
    });

    const newUser = await this.usersRepository.save(userDto);
    return newUser;
  }

  async findAll(options: IPaginationOptions) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const queryBuilder = queryRunner.manager.createQueryBuilder(User, 'u');
      queryBuilder.orderBy('u.createdAt', 'DESC').addOrderBy('id', 'DESC');
      return paginate(queryBuilder, options);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async getUserByUsername(username: string) {
    const userQuery = this.dataSource.createQueryBuilder(User, 'user');
    const user = await userQuery.where('username = :username', { username }).getOne();
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async update(id: number, body: UpdateUserDto) {
    await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const queryBuilder = queryRunner.manager.createQueryBuilder(User, 'u');
      const result = await queryBuilder.update().set(body).where('id = :id', { id }).execute();
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.usersRepository.delete({ id });
  }
}
