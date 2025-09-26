import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHealth() {
    return {
      message: 'CareerCraft AI API is running! 🚀',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV') || 'development',
      status: 'healthy',
    };
  }

  getStatus() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
      api: 'CareerCraft AI',
      version: '1.0.0',
      status: 'operational',
      uptime: {
        seconds: Math.floor(uptime),
        human: this.formatUptime(uptime),
      },
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        unit: 'MB',
      },
      environment: this.configService.get('NODE_ENV') || 'development',
      database: 'connected', // You can add actual DB health check here
      features: {
        authentication: 'Kinde Auth',
        payments: 'Stripe',
        fileStorage: 'Local/Cloud',
        ai: 'OpenAI/Gemini',
      },
      endpoints: {
        docs: '/docs',
        health: '/',
        users: '/users',
        auth: '/auth',
        resumes: '/resumes',
        subscriptions: '/subscriptions',
      },
      timestamp: new Date().toISOString(),
    };
  }

  getVersion() {
    return {
      api: 'CareerCraft AI',
      version: '1.0.0',
      build: process.env.BUILD_NUMBER || 'dev',
      commit: process.env.GIT_COMMIT || 'unknown',
      buildDate: process.env.BUILD_DATE || new Date().toISOString(),
      node: process.version,
      platform: process.platform,
      architecture: process.arch,
    };
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
}