// @ts-nocheck
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
} from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Resumes')
@Controller('resumes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResumesController {
    constructor(private readonly resumesService: ResumesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new resume' })
    @ApiResponse({ status: 201, description: 'Resume created successfully' })
    async create(
        @Body() dto: any,
        @CurrentUser('id') userId: string,
    ) {
        return this.resumesService.create(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all resumes for the current user' })
    @ApiResponse({ status: 200, description: 'List of resumes' })
    async findAll(@CurrentUser('id') userId: string) {
        return this.resumesService.findAll(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific resume by ID' })
    @ApiParam({ name: 'id', description: 'Resume ID' })
    @ApiResponse({ status: 200, description: 'Resume found' })
    @ApiResponse({ status: 404, description: 'Resume not found' })
    async findOne(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.resumesService.findOne(id, userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a resume' })
    @ApiParam({ name: 'id', description: 'Resume ID' })
    @ApiResponse({ status: 200, description: 'Resume updated successfully' })
    async update(
        @Param('id') id: string,
        @Body() dto: any,
        @CurrentUser('id') userId: string,
    ) {
        return this.resumesService.update(id, userId, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a resume' })
    @ApiParam({ name: 'id', description: 'Resume ID' })
    @ApiResponse({ status: 200, description: 'Resume deleted' })
    async remove(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.resumesService.remove(id, userId);
    }

    @Post(':id/duplicate')
    @ApiOperation({ summary: 'Duplicate a resume' })
    @ApiParam({ name: 'id', description: 'Resume ID to duplicate' })
    @ApiResponse({ status: 201, description: 'Resume duplicated successfully' })
    async duplicate(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.resumesService.duplicate(id, userId);
    }

    @Post(':id/analyze')
    @ApiOperation({ summary: 'Trigger ATS analysis for a resume (saves score)' })
    @ApiParam({ name: 'id', description: 'Resume ID' })
    @ApiResponse({ status: 200, description: 'Analysis triggered' })
    async analyze(
        @Param('id') id: string,
        @Body() body: { atsScore?: number },
        @CurrentUser('id') userId: string,
    ) {
        if (body.atsScore !== undefined) {
            return this.resumesService.updateAtsScore(id, userId, body.atsScore);
        }
        return this.resumesService.findOne(id, userId);
    }

    @Post('export')
    @ApiOperation({ summary: 'Export resume as PDF/DOCX' })
    @ApiResponse({ status: 200, description: 'Export initiated' })
    async export(
        @Body() body: { resumeId: string; format?: string },
        @CurrentUser('id') userId: string,
    ) {
        const resume = await this.resumesService.findOne(body.resumeId, userId);
        return {
            success: true,
            message: 'Export ready',
            data: {
                resumeId: resume.id,
                format: body.format || 'pdf',
                downloadUrl: `/resumes/${resume.id}/download`,
            },
        };
    }
}
