// @ts-nocheck
import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Get('search')
    @ApiOperation({ summary: 'Search saved jobs' })
    @ApiQuery({ name: 'q', required: false })
    @ApiQuery({ name: 'location', required: false })
    @ApiResponse({ status: 200, description: 'Job search results' })
    async search(
        @CurrentUser('id') userId: string,
        @Query('q') query?: string,
        @Query('location') location?: string,
    ) {
        return this.jobsService.search(userId, query, location);
    }

    @Get('market-trends')
    @ApiOperation({ summary: 'Get job market trend data' })
    @ApiResponse({ status: 200, description: 'Market trends' })
    async getMarketTrends() {
        return this.jobsService.getMarketTrends();
    }

    @Get('salary-insights')
    @ApiOperation({ summary: 'Get salary insights for a role/location' })
    @ApiQuery({ name: 'role', required: false })
    @ApiQuery({ name: 'location', required: false })
    @ApiResponse({ status: 200, description: 'Salary data' })
    async getSalaryInsights(
        @Query('role') role?: string,
        @Query('location') location?: string,
    ) {
        return this.jobsService.getSalaryInsights(role, location);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific saved job' })
    @ApiResponse({ status: 200, description: 'Job found' })
    async findOne(@Param('id') id: string) {
        return this.jobsService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Save a job listing' })
    @ApiResponse({ status: 201, description: 'Job saved' })
    async create(
        @Body() dto: any,
        @CurrentUser('id') userId: string,
    ) {
        return this.jobsService.create(userId, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a saved job' })
    @ApiResponse({ status: 200, description: 'Job removed' })
    async remove(@Param('id') id: string) {
        return this.jobsService.remove(id);
    }
}
