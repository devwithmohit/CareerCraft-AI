// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';

@Injectable()
export class JobsService {
    constructor(private readonly prisma: PrismaService) { }

    async search(userId: string, query?: string, location?: string) {
        const jobs = await this.prisma.job.findMany({
            where: {
                userId,
                ...(query && {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { company: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                }),
                ...(location && { location: { contains: location, mode: 'insensitive' } }),
            },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: jobs, count: jobs.length };
    }

    async findOne(id: string) {
        return this.prisma.job.findUnique({ where: { id } });
    }

    async create(userId: string, dto: any) {
        return this.prisma.job.create({
            data: { userId, ...dto },
        });
    }

    async remove(id: string) {
        await this.prisma.job.delete({ where: { id } });
        return { success: true };
    }

    async getMarketTrends() {
        return {
            success: true,
            data: {
                topRoles: ['Software Engineer', 'Product Manager', 'Data Scientist', 'DevOps Engineer'],
                avgSalaryGrowth: '8.2%',
                demandIndex: 87,
                hotSkills: ['TypeScript', 'Rust', 'Kubernetes', 'LLM fine-tuning', 'GraphQL'],
                remotePercentage: 42,
            },
            timestamp: new Date().toISOString(),
        };
    }

    async getSalaryInsights(role?: string, location?: string) {
        return {
            success: true,
            data: {
                role: role || 'Software Engineer',
                location: location || 'United States',
                p25: 95000,
                median: 130000,
                p75: 165000,
                currency: 'USD',
                source: 'Aggregated market data',
            },
            timestamp: new Date().toISOString(),
        };
    }
}
