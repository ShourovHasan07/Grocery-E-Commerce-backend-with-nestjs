import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: number) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // 465 হলে true, 587 হলে false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}`,
    });

    console.log('OTP sent to', email);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}
