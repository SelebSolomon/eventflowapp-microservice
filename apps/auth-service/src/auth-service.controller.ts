import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { JwtAuthGuard, LoginDto, RegisterDto } from '@app/shared';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authServiceService.register(
      body.email,
      body.password,
      body.username,
    );
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authServiceService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: { user: { sub: string } }) {
    return this.authServiceService.getProfile(req.user.sub);
  }
}
