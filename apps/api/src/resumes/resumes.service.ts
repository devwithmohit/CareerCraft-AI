// @ts-nocheck
import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/database.service';

@Injectable()
export class ResumesService {
    private readonly logger = new Logger(ResumesService.name);

    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: any) {
        const resume = await this.prisma.resume.create({
            data: {
                userId,
                title: dto.title || 'Untitled Resume',
                content: dto.content || {},
                template: dto.template || 'modern',
                atsScore: dto.atsScore || null,
            },
        });
        this.logger.log(`Resume created: ${resume.id} for user ${userId}`);
        return resume;
    }

    async findAll(userId: string) {
        return this.prisma.resume.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const resume = await this.prisma.resume.findUnique({ where: { id } });
        if (!resume) throw new NotFoundException(`Resume ${id} not found`);
        if (resume.userId !== userId) throw new ForbiddenException('Access denied');
        return resume;
    }

    async update(id: string, userId: string, dto: any) {
        await this.findOne(id, userId); // ownership check
        return this.prisma.resume.update({
            where: { id },
            data: {
                ...(dto.title && { title: dto.title }),
                ...(dto.content && { content: dto.content }),
                ...(dto.template && { template: dto.template }),
                ...(dto.atsScore !== undefined && { atsScore: dto.atsScore }),
            },
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId); // ownership check
        await this.prisma.resume.delete({ where: { id } });
        return { success: true, message: 'Resume deleted' };
    }

    /**
     * Store ATS score after AI analysis
     */
    async updateAtsScore(id: string, userId: string, atsScore: number) {
        await this.findOne(id, userId);
        return this.prisma.resume.update({
            where: { id },
            data: { atsScore },
        });
    }

    /**
     * Duplicate a resume
     */
    async duplicate(id: string, userId: string) {
        const original = await this.findOne(id, userId);
        return this.prisma.resume.create({
            data: {
                userId,
                title: `${original.title} (Copy)`,
                content: original.content,
                template: original.template,
                atsScore: null,
            },
        });
    }
}
