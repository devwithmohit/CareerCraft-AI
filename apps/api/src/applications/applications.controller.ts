import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job application' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Request() req: any,
  ) {
    return this.applicationsService.create(createApplicationDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications for the authenticated user' })
  async findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('company') company?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const filters = {
      status,
      company,
      dateFrom,
      dateTo,
    };

    return this.applicationsService.findAll(req.user.id, filters, {
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get application statistics' })
  async getStats(@Request() req: any) {
    return this.applicationsService.getStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific application' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.applicationsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an application' })
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Request() req: any,
  ) {
    return this.applicationsService.update(id, updateApplicationDto, req.user.id);
  }

  @Post(':id/timeline')
  @ApiOperation({ summary: 'Add timeline event to application' })
  async addTimelineEvent(
    @Param('id') id: string,
    @Body() timelineEvent: any,
    @Request() req: any,
  ) {
    return this.applicationsService.addTimelineEvent(id, timelineEvent, req.user.id);
  }

  @Post(':id/reminders')
  @ApiOperation({ summary: 'Add reminder to application' })
  async addReminder(
    @Param('id') id: string,
    @Body() reminder: any,
    @Request() req: any,
  ) {
    return this.applicationsService.addReminder(id, reminder, req.user.id);
  }

  @Patch(':id/reminders/:reminderId')
  @ApiOperation({ summary: 'Update reminder status' })
  async updateReminder(
    @Param('id') id: string,
    @Param('reminderId') reminderId: string,
    @Body() updateData: any,
    @Request() req: any,
  ) {
    return this.applicationsService.updateReminder(id, reminderId, updateData, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an application' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.applicationsService.remove(id, req.user.id);
  }
}
