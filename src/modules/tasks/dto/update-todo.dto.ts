import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  task: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  done: boolean;

  @ApiProperty({ default: new Date() })
  @IsDateString()
  @IsOptional()
  dueDate: Date;
}
