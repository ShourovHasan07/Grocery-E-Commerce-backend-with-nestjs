// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/admin.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Admin) private readonly adminModel: typeof Admin,
  ) {}

  async adminLogin(data: { email: string; password: string }) {
    const { email, password } = data;

    if (!email || !password) {
      throw new UnauthorizedException('Email & password required');
    }

    const admin = await this.adminModel.findOne({ where: { email } });
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new UnauthorizedException('Password incorrect');

    const token = this.jwtService.sign({
      id: admin.id,
      email: admin.email,
     role: admin.role
,
    
    });

    const { password: _, ...safeAdmin } = admin.toJSON();
    return { message: 'Admin login successful', token, admin: safeAdmin };
  }
}
