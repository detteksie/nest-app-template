import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterReqDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(/^[A-Za-z0-9._-]+$/, { always: true })
  username: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(32)
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  name: string;
}
