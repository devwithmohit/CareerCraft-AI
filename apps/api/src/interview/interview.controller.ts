// @ts-nocheck
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InterviewService } from './interview.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Interview Prep')
@Controller('interview')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InterviewController {
    constructor(private readonly interviewService: InterviewService) { }

    @Post('mock')
    @ApiOperation({ summary: 'Start a mock interview session' })
    @ApiResponse({ status: 201, description: 'Mock session created' })
    async createMock(
        @Body() dto: any,
        @CurrentUser('id') userId: string,
    ) {
        return this.interviewService.createMockSession(userId, dto);
    }

    @Get('questions')
    @ApiOperation({ summary: 'Get interview questions by type and role' })
    @ApiQuery({ name: 'type', required: false, enum: ['behavioral', 'technical', 'system_design'] })
    @ApiQuery({ name: 'role', required: false })
    @ApiResponse({ status: 200, description: 'List of interview questions' })
    async getQuestions(
        @Query('type') type?: string,
        @Query('role') role?: string,
    ) {
        return this.interviewService.getQuestions(type, role);
    }

    @Post('feedback')
    @ApiOperation({ summary: 'Submit feedback for a mock session' })
    @ApiResponse({ status: 200, description: 'Feedback saved' })
    async saveFeedback(
        @Body() body: { sessionId: string; feedback: any },
        @CurrentUser('id') userId: string,
    ) {
        return this.interviewService.saveFeedback(body.sessionId, userId, body.feedback);
    }

    @Get('sessions')
    @ApiOperation({ summary: 'Get all interview sessions for current user' })
    @ApiResponse({ status: 200, description: 'Sessions list' })
    async getSessions(@CurrentUser('id') userId: string) {
        return this.interviewService.getSessions(userId);
    }
}
