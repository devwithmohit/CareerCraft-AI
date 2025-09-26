import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: 'CareerCraft AI',
  version: '1.0.0',
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
}));