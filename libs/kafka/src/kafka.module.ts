import { DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  KAFKA_CLIENT_ID,
  KAFKA_CONSUMER_GROUP,
} from './constants/kafka.constants';

export const KAFKA_SERVICE = 'KAFKA_SERVICE';
export class KafkaModule {
  static register(consumerGroup?: string): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.register([
          {
            name: KAFKA_SERVICE,
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: KAFKA_CLIENT_ID,
                brokers: [process.env.KAFKA_BROKER ?? 'localhost:9094'],
              },
              consumer: {
                groupId: consumerGroup ?? KAFKA_CONSUMER_GROUP,
              },
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
