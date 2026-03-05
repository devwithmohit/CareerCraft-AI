// @ts-nocheck
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createApplicationDto: CreateApplicationDto, userId: string) {
    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        userId,
        timeline: {
          create: [
            {
              type: 'applied',
              description: 'Application created',
              date: new Date(),
            },
          ],
        },
      },
      include: {
        job: true,
        resume: true,
        timeline: true,
        reminders: true,
        contacts: true,
      },
    });

    return application;
  }

  async findAll(
    userId: string,
    filters: any = {},
    pagination: { page: number; limit: number },
  ) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    // Apply filters
    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.company) {
      where.job = {
        company: {
          contains: filters.company,
          mode: 'insensitive',
        },
      };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.appliedAt = {};
      if (filters.dateFrom) {
        where.appliedAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.appliedAt.lte = new Date(filters.dateTo);
      }
    }

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: {
          job: true,
          resume: {
            select: { id: true, title: true },
          },
          timeline: {
            orderBy: { date: 'desc' },
            take: 3,
          },
          reminders: {
            where: { completed: false },
            orderBy: { date: 'asc' },
          },
          contacts: true,
          _count: {
            select: {
              timeline: true,
              reminders: { where: { completed: false } },
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
      include: {
        job: true,
        resume: true,
        timeline: {
          orderBy: { date: 'desc' },
        },
        reminders: {
          orderBy: { date: 'asc' },
        },
        contacts: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto, userId: string) {
    const existingApplication = await this.findOne(id, userId);

    // If status is changing, add timeline event
    const shouldAddTimelineEvent =
      updateApplicationDto.status &&
      updateApplicationDto.status !== existingApplication.status;

    const updateData: any = {
      ...updateApplicationDto,
    };

    if (shouldAddTimelineEvent) {
      updateData.timeline = {
        create: {
          type: this.mapStatusToTimelineType(updateApplicationDto.status),
          description: `Status changed to ${updateApplicationDto.status}`,
          date: new Date(),
        },
      };
    }

    const application = await this.prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        job: true,
        resume: true,
        timeline: {
          orderBy: { date: 'desc' },
        },
        reminders: true,
        contacts: true,
      },
    });

    return application;
  }

  async addTimelineEvent(id: string, timelineEvent: any, userId: string) {
    await this.findOne(id, userId); // Check ownership

    const event = await this.prisma.application.create({
      data: {
        ...timelineEvent,
        applicationId: id,
        date: new Date(timelineEvent.date),
      },
    });

    return event;
  }

  async addReminder(id: string, reminder: any, userId: string) {
    await this.findOne(id, userId); // Check ownership

    const newReminder = await this.prisma.application.create({
      data: {
        ...reminder,
        applicationId: id,
        date: new Date(reminder.date),
        completed: false,
      },
    });

    return newReminder;
  }

  async updateReminder(
    applicationId: string,
    reminderId: string,
    updateData: any,
    userId: string,
  ) {
    await this.findOne(applicationId, userId); // Check ownership

    const reminder = await this.prisma.application.update({
      where: { id: reminderId },
      data: updateData,
    });

    return reminder;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Check ownership

    await this.prisma.application.delete({
      where: { id },
    });

    return { message: 'Application deleted successfully' };
  }

  async getStats(userId: string) {
    const [
      total,
      applied,
      interviews,
      offers,
      rejected,
      responseRate,
      avgResponseTime,
    ] = await Promise.all([
      this.prisma.application.count({ where: { userId } }),
      this.prisma.application.count({ where: { userId, status: 'applied' } }),
      this.prisma.application.count({ where: { userId, status: 'interview' } }),
      this.prisma.application.count({ where: { userId, status: 'offer' } }),
      this.prisma.application.count({ where: { userId, status: 'rejected' } }),
      this.calculateResponseRate(userId),
      this.calculateAvgResponseTime(userId),
    ]);

    return {
      total,
      applied,
      interviews,
      offers,
      rejected,
      responseRate,
      avgResponseTime,
      conversionRate: {
        applicationToInterview: total > 0 ? (interviews / total) * 100 : 0,
        interviewToOffer: interviews > 0 ? (offers / interviews) * 100 : 0,
      },
    };
  }

  private async calculateResponseRate(userId: string): Promise<number> {
    const total = await this.prisma.application.count({ where: { userId } });
    const responses = await this.prisma.application.count({
      where: {
        userId,
        status: {
          in: ['interview', 'offer', 'rejected'],
        },
      },
    });

    return total > 0 ? (responses / total) * 100 : 0;
  }

  private async calculateAvgResponseTime(userId: string): Promise<number> {
    const applications = await this.prisma.application.findMany({
      where: { userId },
      include: {
        timeline: {
          where: {
            type: { in: ['response', 'interview', 'offer', 'rejection'] },
          },
          orderBy: { date: 'asc' },
          take: 1,
        },
      },
    });

    const responseTimes = applications
      .filter(app => app.timeline.length > 0)
      .map(app => {
        const appliedDate = new Date(app.appliedAt);
        const responseDate = new Date(app.timeline[0].date);
        return responseDate.getTime() - appliedDate.getTime();
      });

    if (responseTimes.length === 0) return 0;

    const avgMs = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    return Math.round(avgMs / (1000 * 60 * 60 * 24)); // Convert to days
  }

  private mapStatusToTimelineType(status: string): string {
    const mapping = {
      applied: 'applied',
      interview: 'interview',
      offer: 'offer',
      rejected: 'rejection',
      withdrawn: 'note',
      draft: 'note',
    };

    return mapping[status] || 'note';
  }
}
