import { KAFKA_TOPICS } from '@app/kafka';
import { KAFKA_SERVICE } from '@app/kafka/kafka.module';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // connect to kafka whem module initialise
    await this.kafkaClient.connect();
  }

  gethello(): string {
    return 'hello world';
  }

  simulateuserREgistration(email: string) {
    // publish event to kafka
    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
      email,
      timeStamp: new Date().toISOString(),
    });
    return { message: `user registered ${email}` };
  }
}
