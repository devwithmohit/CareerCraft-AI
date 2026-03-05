// @ts-nocheck
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('database.url'),
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Log database queries in development
    if (this.configService.get('NODE_ENV') === 'development') {
      this.$on('query', (e) => {
        this.logger.log(`Query: ${e.query}`);
        this.logger.log(`Params: ${e.params}`);
        this.logger.log(`Duration: ${e.duration}ms`);
      });
    }

    this.$on('error', (e) => {
      this.logger.error('Database error:', e);
    });

    this.$on('warn', (e) => {
      this.logger.warn('Database warning:', e);
    });

    this.$on('info', (e) => {
      this.logger.log('Database info:', e);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
      
      // Test the connection
      await this.$queryRaw`SELECT 1`;
      this.logger.log('✅ Database health check passed');
    } catch (error) {
      this.logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('🔌 Database disconnected');
    } catch (error) {
      this.logger.error('❌ Error disconnecting from database:', error);
    }
  }

  // Helper method to check database health
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }

  // Helper method for clean shutdown
  async enableShutdownHooks(app: any) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}