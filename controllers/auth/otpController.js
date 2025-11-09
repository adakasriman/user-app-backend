// controllers/otp.controller.js

const { sendOtpService, verifyOtpService } = require('../../service/otpService');
const { OtpRequestDTO, OtpVerifyDTO } = require('../../dtos/user/otp.dto');

const sendOtp = async (req, res) => {
    try {
        const otpDto = new OtpRequestDTO(req.body);
        const response = await sendOtpService(otpDto);
        res.status(200).json(response);
    } catch (err) {
        console.error('❌ OTP send error:', err);
        res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const otpDto = new OtpVerifyDTO(req.body);
        const response = await verifyOtpService(otpDto);
        res.status(200).json(response);
    } catch (err) {
        console.error('❌ OTP verify error:', err);
        res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    }
};

module.exports = { sendOtp, verifyOtp };
