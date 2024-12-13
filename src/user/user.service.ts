import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  private readonly jwtSecret = 'your-secret-key'; // Ensure this is consistent

  async register(email: string): Promise<void> {
    let user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      user = this.userRepository.create({ email });
      await this.userRepository.save(user);
    }
    const magicToken = this.jwtService.sign(
      { email },
      { expiresIn: '15m', secret: this.jwtSecret },
    );

    user.magicToken = magicToken;
    await this.userRepository.save(user);

    // Send magic link via email
    const magicLink = `http://localhost:3000/user/magic-login?token=${magicToken}`;
    console.log(`Magic link for ${email}: ${magicLink}`);

    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: 'Magic Link Login',
    //   text: `Click here to log in: ${magicLink}`,
    // });
  }

  async validateMagicToken(token: string): Promise<string> {
    console.log('Token:', token);
    const { email } = this.jwtService.verify(token, { secret: this.jwtSecret });
    const user = await this.userRepository.findOne({
      where: { email, magicToken: token },
    });
    if (!user) {
      throw new Error('Invalid or expired magic token');
    }
    user.magicToken = null; // Invalidate the token
    await this.userRepository.save(user);
    return this.jwtService.sign({ id: user.id, isAdmin: user.isAdmin });
  }

  async getProfile(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
