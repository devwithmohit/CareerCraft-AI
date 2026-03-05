// @ts-nocheck
import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) { }

  async validateKindeUser(kindePayload: any) {
    try {
      const { sub: kindeId, email, given_name, family_name, picture } = kindePayload;
      let user = await this.usersService.findByKindeId(kindeId);
      if (!user) {
        user = await this.usersService.create({ kindeId, email, firstName: given_name, lastName: family_name, avatar: picture });
      } else {
        user = await this.usersService.update(user.id, { email, firstName: given_name, lastName: family_name, avatar: picture });
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid Kinde token');
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateKindeUser(loginDto.kindePayload);
    const payload = { sub: user.id, kindeId: user.kindeId, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar },
    };
  }

  /** Email/password registration — for frontend form auth */
  async emailRegister(dto: { firstName: string; lastName: string; email: string; password: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('An account with that email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const tempKindeId = `local_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    const user = await this.prisma.user.create({
      data: {
        kindeId: tempKindeId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        avatar: `__pw__${hashedPassword}`,
      },
    });

    const payload = { sub: user.id, kindeId: user.kindeId, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatar: null },
    };
  }

  /** Email/password login — for frontend form auth */
  async emailLogin(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (user.avatar?.startsWith('__pw__')) {
      const storedHash = user.avatar.replace('__pw__', '');
      const valid = await bcrypt.compare(dto.password, storedHash);
      if (!valid) throw new UnauthorizedException('Invalid email or password');
    } else {
      throw new UnauthorizedException('Please use your social login provider for this account');
    }

    const payload = { sub: user.id, kindeId: user.kindeId, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatar: null },
    };
  }

  async validateUser(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const { kindeId, avatar, ...profile } = user;
    return { ...profile, avatar: avatar?.startsWith('__pw__') ? null : avatar };
  }

  async verifyKindeWebhook(payload: any) {
    const { type, data } = payload;
    switch (type) {
      case 'user.updated': await this.handleUserUpdated(data); break;
      case 'user.deleted': await this.handleUserDeleted(data); break;
      default: console.log(`Unhandled webhook type: ${type}`);
    }
  }

  private async handleUserUpdated(userData: any) {
    const user = await this.usersService.findByKindeId(userData.id);
    if (user) await this.usersService.update(user.id, { email: userData.email, firstName: userData.given_name, lastName: userData.family_name, avatar: userData.picture });
  }

  private async handleUserDeleted(userData: any) {
    const user = await this.usersService.findByKindeId(userData.id);
    if (user) await this.usersService.remove(user.id);
  }
}
