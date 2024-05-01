import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ default: 'detteksie@mailsac.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'detteksie' })
  @Matches(/^[A-Za-z0-9._-]+$/, { always: true })
  username: string;

  @ApiProperty({ default: 'asdf1234' })
  @MinLength(8)
  @MaxLength(32)
  @IsString()
  password: string;

  @ApiProperty({ default: 'Detteksie Smantie' })
  @IsString()
  name: string;
}
