// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getSummary(userId: string) {
        const [
            totalApplications,
            byStatus,
            totalResumes,
            recentApplications,
        ] = await Promise.all([
            this.prisma.application.count({ where: { userId } }),
            this.prisma.application.groupBy({
                by: ['status'],
                where: { userId },
                _count: { status: true },
            }),
            this.prisma.resume.count({ where: { userId } }),
            this.prisma.application.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                take: 5,
                select: { id: true, company: true, position: true, status: true, appliedAt: true },
            }),
        ]);

        const statusMap = Object.fromEntries(
            byStatus.map(s => [s.status, s._count.status])
        );

        const interviews = statusMap['INTERVIEWING'] || 0;
        const offers = statusMap['OFFERED'] || 0;
        const rejections = statusMap['REJECTED'] || 0;
        const rejectionRate = totalApplications > 0
            ? Math.round((rejections / totalApplications) * 100)
            : 0;

        // Best ATS score from resumes
        const topResume = await this.prisma.resume.findFirst({
            where: { userId, atsScore: { not: null } },
            orderBy: { atsScore: 'desc' },
            select: { atsScore: true },
        });

        return {
            success: true,
            data: {
                totalApplications,
                interviews,
                offers,
                rejectionRate,
                resumeScore: topResume?.atsScore ?? null,
                totalResumes,
                applicationsByStatus: statusMap,
                recentActivity: recentApplications,
            },
            timestamp: new Date().toISOString(),
        };
    }
}
