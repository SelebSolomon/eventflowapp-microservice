import { DatabaseService, users } from '@app/database';
import { KAFKA_SERVICE } from '@app/kafka/kafka.module';
import {
  ConflictException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { KAFKA_TOPICS } from '@app/kafka';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // connect to kafka whem module initialise
    await this.kafkaClient.connect();
  }
  //
  async register(email: string, password: string, username: string) {
    const existingUser = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // create user

    const [user] = await this.databaseService.db
      .insert(users)
      .values({ email, password: hashedPassword, username })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
      });

    console.log('emailllll', user.email);
    // send user registered event
    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toDateString(),
    });

    return { message: 'User registered successfully', user };
  }

  async login(email: string, password: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    this.kafkaClient.emit(KAFKA_TOPICS.USER_LOGIN, {
      userId: user.id,
      timestamp: new Date().toISOString(),
    });
    return {
      access_token: token,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const [user] = await this.databaseService.db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return user;
  }

  // simulateuserREgistration(email: string) {
  //   // publish event to kafka
  //   this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
  //     email,
  //     timeStamp: new Date().toISOString(),
  //   });
  //   return { message: `user registered ${email}` };
  // }
}
