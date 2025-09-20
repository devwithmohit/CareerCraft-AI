import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  kindeSecret: process.env.KINDE_CLIENT_SECRET,
  kindeClientId: process.env.KINDE_CLIENT_ID,
  kindeDomain: process.env.KINDE_DOMAIN,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));