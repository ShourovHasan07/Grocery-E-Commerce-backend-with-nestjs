import { Injectable } from '@nestjs/common';
import { User } from '../users/user.model';
import { Otp } from '../users/otp.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { sendOtpEmail } from '../common/utils/sendOtpEmail';
import { sendOtpSms } from '../common/utils/sendOtpSms';

@Injectable()
export class AuthUserService {
  private generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async sendOtp(identifier: string) {
    let user = await User.findOne({
      where: identifier.includes('@')
        ? { email: identifier }
        : { phone: identifier },
    });

    if (!user) {
  user = await User.create({
    email: identifier.includes('@') ? identifier : null,
    phone: identifier.includes('@') ? null : identifier,
    password: '',
  });
}


    //  remove old OTPs
    await Otp.destroy({ where: { userId: user.id } });

    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp.toString(), 10);

    await Otp.create({
      userId: user.id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    if (identifier.includes('@')) {
      await sendOtpEmail(identifier, otp);
    } else {
      await sendOtpSms(identifier, otp);
    }

    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(identifier: string, otp: string) {
    const user = await User.findOne({
      where: identifier.includes('@')
        ? { email: identifier }
        : { phone: identifier },
    });

    if (!user) throw new Error('User not found');


    // now  token is  correct 

    const otpRecord = await Otp.findOne({
      where: {
        userId: user.id,
        expiresAt: { [Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) throw new Error('OTP expired');

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValid) throw new Error('Invalid OTP');

    await otpRecord.destroy();

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' },
    );

    return { success: true, user, token };
  }
}
