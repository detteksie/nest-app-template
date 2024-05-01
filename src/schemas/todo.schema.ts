import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema({
  collection: 'todo',
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
})
export class Todo {
  @Prop({
    type: Number,
    required: true,
  })
  @ApiProperty()
  userId: number;

  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty()
  task: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  @ApiProperty()
  done: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  @ApiProperty()
  dueDate: Date;
}

export type TodoDocument = Todo & mongoose.Document;

export const TodoSchema = SchemaFactory.createForClass(Todo);
