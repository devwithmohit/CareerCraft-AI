import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Kinde authentication payload',
    example: {
      sub: 'kp_user123',
      email: 'user@example.com',
      given_name: 'John',
      family_name: 'Doe',
      picture: 'https://avatar.url',
    },
  })
  @IsObject()
  @IsNotEmpty()
  kindePayload: any;
}