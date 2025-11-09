// repositories/userRepository.js
const User = require('../models/User');

// Find user by email
const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

// Create new user
const createUser = async (userData) => {
    return await User.create(userData);
};

// Find user by ID
const findUserById = async (id) => {
    return await User.findByPk(id);
};

module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
};
