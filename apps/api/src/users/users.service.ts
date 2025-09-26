import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          // Create free subscription by default
          subscription: {
            create: {
              plan: 'FREE',
              status: 'ACTIVE',
            },
          },
        },
        include: {
          subscription: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User with this email already exists');
        }
      }
      throw error;
    }
  }

  async findAll(skip = 0, take = 10) {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      include: {
        subscription: true,
        _count: {
          select: {
            resumes: true,
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prisma.user.count();

    return {
      users,
      pagination: {
        total,
        pages: Math.ceil(total / take),
        currentPage: Math.floor(skip / take) + 1,
        limit: take,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        resumes: {
          orderBy: { updatedAt: 'desc' },
          take: 5, // Latest 5 resumes
        },
        applications: {
          orderBy: { updatedAt: 'desc' },
          take: 10, // Latest 10 applications
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true,
      },
    });
  }

  async findByKindeId(kindeId: string) {
    return this.prisma.user.findUnique({
      where: { kindeId },
      include: {
        subscription: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        include: {
          subscription: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Email already taken');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });

      return { message: `User with ID ${id} has been deleted` };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async getUserStats(id: string) {
    const user = await this.findOne(id);
    
    const stats = await this.prisma.$transaction([
      // Total resumes
      this.prisma.resume.count({
        where: { userId: id },
      }),
      // Total applications
      this.prisma.application.count({
        where: { userId: id },
      }),
      // Applications by status
      this.prisma.application.groupBy({
        by: ['status'],
        where: { userId: id },
        _count: true,
      }),
      // Recent activity
      this.prisma.resume.findMany({
        where: { userId: id },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        subscription: user.subscription,
      },
      stats: {
        totalResumes: stats[0],
        totalApplications: stats[1],
        applicationsByStatus: stats[2],
        recentActivity: stats[3],
      },
    };
  }
}