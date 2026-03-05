// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';

@Injectable()
export class InterviewService {
    constructor(private readonly prisma: PrismaService) { }

    async createMockSession(userId: string, dto: any) {
        const session = await this.prisma.interviewPrep.create({
            data: {
                userId,
                type: dto.type || 'behavioral',
                questions: dto.questions || [],
                feedback: null,
            },
        });
        return { success: true, data: session };
    }

    async getQuestions(type?: string, role?: string) {
        const questionBank = {
            behavioral: [
                'Tell me about a time you handled a difficult situation.',
                'Describe a project you are most proud of.',
                'How do you handle disagreements with team members?',
                'Tell me about a time you failed and what you learned.',
                'How do you prioritize tasks under pressure?',
            ],
            technical: [
                'Explain the difference between REST and GraphQL.',
                'What is a closure in JavaScript?',
                'How does async/await work under the hood?',
                'Explain the SOLID principles.',
                'What is the difference between SQL and NoSQL databases?',
            ],
            system_design: [
                'Design a URL shortener.',
                'How would you design a scalable notification system?',
                'Design a job board system.',
                'How would you architect a real-time chat application?',
            ],
        };

        const selectedType = type || 'behavioral';
        const questions = questionBank[selectedType] || questionBank.behavioral;

        return {
            success: true,
            data: {
                type: selectedType,
                role: role || 'Software Engineer',
                questions: questions.map((q, i) => ({ id: i + 1, question: q, type: selectedType })),
            },
            count: questions.length,
        };
    }

    async saveFeedback(sessionId: string, userId: string, feedback: any) {
        const updated = await this.prisma.interviewPrep.update({
            where: { id: sessionId },
            data: { feedback },
        });
        return { success: true, data: updated };
    }

    async getSessions(userId: string) {
        const sessions = await this.prisma.interviewPrep.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: sessions, count: sessions.length };
    }
}
