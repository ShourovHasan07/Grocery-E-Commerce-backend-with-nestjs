// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtStrategy } from '../auth/jwt.strategy/jwt.strategy';
import { AdminJwtStrategy } from '../auth/jwt.strategy/jwt.admin.strategy';

import { Admin } from '../admin/admin.model';
import { User } from '../users/user.model';
import { AuthUserService } from './auth.user.service';
import { Otp } from 'src/users/otp.model';
import { AuthUserController } from './auth.user.controller';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),

    SequelizeModule.forFeature([Admin, User,Otp]),
  ],
  controllers: [AuthController,AuthUserController],
  providers: [AuthService,  AuthUserService, JwtStrategy,AdminJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
