// services/otp.service.js
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/mailer');
const { saveOtp, getOtp, deleteOtp } = require('../repositories/otpRepository');

const sendOtpService = async (otpRequestDto) => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
  const hashedOtp = await bcrypt.hash(otp, 10);

  await saveOtp(otpRequestDto.email, hashedOtp);

  await sendEmail(otpRequestDto.email, 'Your OTP Code', `Your OTP is: ${otp}`);
  return { status: 200, message: 'OTP sent successfully' };
};

const verifyOtpService = async (otpVerifyDto) => {
  const storedOtp = await getOtp(otpVerifyDto.email);
  if (!storedOtp) throw { status: 400, message: 'OTP expired or not found' };

  const isMatch = await bcrypt.compare(otpVerifyDto.otp, storedOtp);
  if (!isMatch) throw { status: 400, message: 'Invalid OTP' };

  // ✅ OTP valid — generate token
  const token = jwt.sign({ email: otpVerifyDto.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // remove OTP after successful verification
  await deleteOtp(otpVerifyDto.email);

  return { status: 200, message: 'OTP verified successfully', token };
};

module.exports = { sendOtpService, verifyOtpService };
