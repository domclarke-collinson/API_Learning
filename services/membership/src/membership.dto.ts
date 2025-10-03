import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class createUser {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;
  
    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value || null)
    name?: string;
  }