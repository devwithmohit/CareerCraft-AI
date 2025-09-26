import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validateKindeUser(kindePayload: any) {
    try {
      const { sub: kindeId, email, given_name, family_name, picture } = kindePayload;
      
      // Find or create user
      let user = await this.usersService.findByKindeId(kindeId);
      
      if (!user) {
        // Create new user from Kinde data
        user = await this.usersService.create({
          kindeId,
          email,
          firstName: given_name,
          lastName: family_name,
          avatar: picture,
        });
      } else {
        // Update existing user with latest Kinde data
        user = await this.usersService.update(user.id, {
          email,
          firstName: given_name,
          lastName: family_name,
          avatar: picture,
        });
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid Kinde token');
    }
  }

  async login(loginDto: LoginDto) {
    // This will be called after Kinde validates the user
    const user = await this.validateKindeUser(loginDto.kindePayload);
    
    const payload = { 
      sub: user.id, 
      kindeId: user.kindeId,
      email: user.email 
    };
    
    const accessToken = this.jwtService.sign(payload);
    
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    };
  }

  async validateUser(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // Don't return sensitive data
    const { kindeId, ...profile } = user;
    return profile;
  }

  async verifyKindeWebhook(payload: any) {
    // Handle Kinde webhooks for user updates, deletions, etc.
    const { type, data } = payload;
    
    switch (type) {
      case 'user.updated':
        await this.handleUserUpdated(data);
        break;
      case 'user.deleted':
        await this.handleUserDeleted(data);
        break;
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }
  }

  private async handleUserUpdated(userData: any) {
    const user = await this.usersService.findByKindeId(userData.id);
    if (user) {
      await this.usersService.update(user.id, {
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name,
        avatar: userData.picture,
      });
    }
  }

  private async handleUserDeleted(userData: any) {
    const user = await this.usersService.findByKindeId(userData.id);
    if (user) {
      await this.usersService.remove(user.id);
    }
  }
}