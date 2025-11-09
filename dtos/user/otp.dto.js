// dtos/otp.dto.js
class OtpRequestDTO {
    constructor({ email }) {
        this.email = email?.toLowerCase().trim();
    }
}

class OtpVerifyDTO {
    constructor({ email, otp }) {
        this.email = email?.toLowerCase().trim();
        this.otp = otp;
    }
}

module.exports = { OtpRequestDTO, OtpVerifyDTO };
