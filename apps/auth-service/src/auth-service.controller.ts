import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get()
  getHello(): string {
    return this.authServiceService.gethello();
  }

  @Post('register')
  register(@Body() body: { email: string }) {
    return this.authServiceService.simulateuserREgistration(body.email);
  }
}
