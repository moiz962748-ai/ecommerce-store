import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return await this.authService.registerUser(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return await this.authService.loginUser(body);
  }

  // Sirf Admin access kar sakta hai test route
  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  getProfile(@Req() req: any) {
    return {
      message: 'Aap authenticated ADMIN hain!',
      user: req.user,
    };
  }
}