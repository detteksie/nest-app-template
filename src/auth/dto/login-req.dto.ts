import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginReqDto {
  @ApiProperty()
  @IsString()
  userSession: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(32)
  @IsString()
  password: string;
}
