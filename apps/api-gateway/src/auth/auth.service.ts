import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SERVICES_PORT } from '@app/shared';

@Injectable()
export class AuthService {
  private readonly authserviceUrl = `http://localhost:${SERVICES_PORT.AUTH_SERVICE}`;
  constructor(private readonly httpService: HttpService) {}

  async register(data: { email: string; password: string; username: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authserviceUrl}/register`, data),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authserviceUrl}/login`, data),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getProfile(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authserviceUrl}/profile`, {
          headers: { Authorization: token },
        }),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.response) {
      throw new HttpException(error.resposne.data, error.resposne.status);
    }
    throw new HttpException('something went wrong', 503);
  }
}
