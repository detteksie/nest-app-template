import { IPaginationOptions } from '@app/typeorm-paginate';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { User } from '~/entities/user.entity';
import { Todo, TodoDocument } from '~/schemas/todo.schema';
import { mongoosePaginate } from '~/utils/mongoose-paginate';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: mongoose.Model<TodoDocument>,
  ) {}

  async create(user: User, body: CreateTodoDto) {
    const newTodo = new this.todoModel({
      userId: user.id,
      task: body.task,
      dueDate: body.dueDate,
    });
    const result = await newTodo.save();
    return result;
  }

  async findAll(options: IPaginationOptions) {
    return mongoosePaginate(this.todoModel.find(), options);
  }

  async findAllMe(user: User, options: IPaginationOptions) {
    return mongoosePaginate(this.todoModel.find({ userId: user.id }), options);
  }

  async findOne(id: ObjectId) {
    const result = await this.todoModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException('task not found');
    }
    return result;
  }

  async update(id: ObjectId, body: UpdateTodoDto) {
    const found = await this.findOne(id);
    const result = await found
      .updateOne({
        task: body.task,
        done: body.done,
        dueDate: body.dueDate,
      })
      .exec();
    return result;
  }

  async remove(id: ObjectId) {
    const found = await this.findOne(id);
    const result = await found.deleteOne().exec();
    return result;
  }
}
