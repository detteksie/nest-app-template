import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ default: 'Say hi!' })
  @IsString()
  task: string;

  @ApiProperty({ default: new Date() })
  @IsDateString()
  dueDate: Date;
}
