const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  // For encrypting OTP if you want to store it

// Create an email transporter (use your own SMTP server here)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
});

// Endpoint to send OTP
const sendOtp = async (req, res) => {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });

    // Hash the OTP before saving it (for security reasons)
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP to the database for later verification (e.g., in a Redis cache or DB)
    // Assuming you have a User model, save it to the user's record
    // You can also store OTP in Redis with an expiry time to invalidate it after a set period
    // user.saveOtp(email, hashedOtp);

    // Send OTP via email
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'OTP sent successfully!' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send({ error: 'Failed to send OTP' });
    }
};

// Endpoint to verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    // Retrieve the hashed OTP stored in the database (or Redis)
    const storedOtp = await getOtpFromDatabase(email); // Get OTP from DB or cache

    // Verify the OTP
    const isValid = await bcrypt.compare(otp, storedOtp);

    if (isValid) {
        // OTP is valid; process the login or registration
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({
            message: 'OTP verified successfully',
            user: { id: user.id, name: user.name, gmail: user.gmail },
            token
        });
    } else {
        res.status(400).send({ error: 'Invalid OTP' });
    }
};

// Mock function to get OTP from the database (replace with real DB query)
const getOtpFromDatabase = async (email) => {
    // Assume we fetch the OTP from DB or cache
    return 'hashedOtpFromDatabase'; // Replace with actual OTP hash from DB
};

module.exports = { sendOtp, verifyOtp };
