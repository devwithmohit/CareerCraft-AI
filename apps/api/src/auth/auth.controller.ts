// @ts-nocheck
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // ── Kinde OAuth token login ──────────────────────────────
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Kinde token (OAuth flow)' })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ── Email/password registration ──────────────────────────
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register with email and password' })
  @ApiResponse({ status: 201, description: 'Registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() body: { firstName: string; lastName: string; email: string; password: string }) {
    return this.authService.emailRegister(body);
  }

  // ── Email/password login ─────────────────────────────────
  @Post('email-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async emailLogin(@Body() body: { email: string; password: string }) {
    return this.authService.emailLogin(body);
  }

  // ── Profile ──────────────────────────────────────────────
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  // ── Refresh token ─────────────────────────────────────────
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@CurrentUser() user: any) {
    return this.authService.login({ kindePayload: user });
  }

  // ── Logout (stateless — client removes token) ─────────────
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (client removes JWT)' })
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Successfully logged out' };
  }

  // ── Kinde webhook receiver ────────────────────────────────
  @Post('webhooks/kinde')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Kinde webhooks' })
  async handleKindeWebhook(@Body() payload: any) {
    await this.authService.verifyKindeWebhook(payload);
    return { message: 'Webhook processed successfully' };
  }
}
