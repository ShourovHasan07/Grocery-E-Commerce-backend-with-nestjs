// src/modules/auth/auth-user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { User, UserCreationAttributes } from '../users/user.model';
import { ClerkLoginDto } from './dto/clerk-login.dto';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async clerkLogin(data: ClerkLoginDto) {
    const { clerkId, email, name } = data;

    let user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      user = await this.userModel.create({
        clerkId,
        email,
        name,
        password: '',
        status: true,
      } as UserCreationAttributes);
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      type: 'USER',
    });

    return {
      message: 'Login successful',
      token,
      user,
    };
  }
}
