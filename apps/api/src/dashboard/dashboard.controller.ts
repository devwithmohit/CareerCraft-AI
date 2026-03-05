// @ts-nocheck
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('summary')
    @ApiOperation({ summary: 'Get dashboard summary for current user' })
    @ApiResponse({ status: 200, description: 'Dashboard summary' })
    async getSummary(@CurrentUser('id') userId: string) {
        return this.dashboardService.getSummary(userId);
    }
}
