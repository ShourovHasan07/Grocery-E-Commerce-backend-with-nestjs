import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export const sendOtpSms = async (phoneNumber: string, otp: number) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      from: fromNumber,
      to: phoneNumber,
    });
    console.log('OTP SMS sent: ', message.sid);
    return true;
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    throw new Error('Failed to send OTP SMS');
  }
};
