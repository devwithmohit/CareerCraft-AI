// @ts-nocheck
import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [InterviewController],
    providers: [InterviewService],
})
export class InterviewModule { }
