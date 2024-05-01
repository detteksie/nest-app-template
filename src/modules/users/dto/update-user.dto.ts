import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum SexType {
  Unknown = 'Unknown',
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export class UpdateUserDto {
  @ApiProperty({ default: 'Detteksie Smantie' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ enum: SexType })
  @IsEnum(SexType)
  @IsOptional()
  sexType: SexType;

  @ApiProperty({ default: '2002-02-02' })
  @IsString()
  @IsOptional()
  birthdate: string;

  @ApiProperty({ default: '081234567890' })
  @IsString()
  @IsOptional()
  telephone: string;
}
