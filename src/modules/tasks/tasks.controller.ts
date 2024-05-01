import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '~/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from '~/pipes/parse-object-id.pipe';
import { PaginationQuery, PaginationQueryPipe } from '~/utils/pagination-query.util';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TasksService } from './tasks.service';

@ApiTags('todo-list')
@ApiBearerAuth()
@Controller({
  path: 'tasks',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: Request, @Body() body: CreateTodoDto) {
    return this.tasksService.create(req.user, body);
  }

  @Get()
  findAll(@Query(new PaginationQueryPipe()) query: PaginationQuery) {
    return this.tasksService.findAll({
      page: query.page,
      limit: query.limit,
      route: '/v1/tasks',
    });
  }

  @Get('/me')
  findAllMe(@Req() req: Request, @Query(new PaginationQueryPipe()) query: PaginationQuery) {
    return this.tasksService.findAllMe(req.user, {
      page: query.page,
      limit: query.limit,
      route: '/v1/tasks',
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateTodoDto) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.tasksService.remove(id);
  }
}
