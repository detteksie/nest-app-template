import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UsernameResDto {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  picture: string;

  @ApiProperty()
  @Expose()
  sexType: string;
}
