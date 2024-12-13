import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'your-secret-key', // TODO: generate dynamic secret key.
      signOptions: { expiresIn: '60s' },
    }),
    //TODO: replace hard-coded values with environment variables
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'user@example.com',
          pass: 'password',
        },
      },
    }),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController], // Ensure UserController is declared here
})
export class UserModule {}
