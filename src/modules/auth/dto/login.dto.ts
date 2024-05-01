import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'detteksie' })
  @IsString()
  userSession: string;

  @ApiProperty({ default: 'asdf1234' })
  @MinLength(8)
  @MaxLength(32)
  @IsString()
  password: string;
}

export class LoginResponse {
  @ApiProperty()
  tokenType: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
