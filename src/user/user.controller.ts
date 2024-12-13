import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-guard.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body('email') email: string): Promise<string> {
    await this.userService.register(email);
    return 'Magic link sent to your email.';
  }

  @Get('magic-login')
  async magicLogin(
    @Query('token') token: string,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.userService.validateMagicToken(token);
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req): Promise<any> {
    console.log('Decoded User:', req.user); // This will log the user object
    return this.userService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async admin(@Req() req): Promise<any> {
    if (!req.user.isAdmin) {
      throw new Error('Unauthorized');
    }
    return this.userService.getAllUsers();
  }
}
