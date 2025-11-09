// repositories/otp.repository.js
const otpStore = new Map(); // TEMP store (use Redis or DB in production)

const saveOtp = async (email, hashedOtp) => {
  otpStore.set(email, hashedOtp);
};

const getOtp = async (email) => {
  return otpStore.get(email);
};

const deleteOtp = async (email) => {
  otpStore.delete(email);
};

module.exports = { saveOtp, getOtp, deleteOtp };
