import { SERVICES_PORT } from '@app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `API GATEWAY is running on port ${SERVICES_PORT.API_GATEWAY}`;
  }
}
