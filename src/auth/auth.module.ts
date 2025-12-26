// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { Admin } from '../admin/admin.model';
import { User } from '../users/user.model';
import { AuthUserController } from './auth.user.controller';
import { AuthUserService } from './auth.user.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwtSecretKey123',
      signOptions: { expiresIn: '7d' },
    }),
    SequelizeModule.forFeature([Admin, User]),
  ],
  controllers: [AuthController,AuthUserController],
  providers: [AuthService,  AuthUserService, JwtStrategy],
  exports: [AuthService,AuthUserService ],
})
export class AuthModule {}
