import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'kp_user123' })
  @IsString()
  kindeId: string;

  @ApiProperty({ example: 'https://avatar.url', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}