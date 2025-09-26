import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    // Use forwardRef to avoid circular dependency with AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}