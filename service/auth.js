// service/auth.js
const bcrypt = require('bcryptjs');
const { findUserByEmail, createUser } = require('../repositories/userRepository');

const signupService = async (userDto) => {
  const existingUser = await findUserByEmail(userDto.email);
  if (existingUser) throw { status: 409, message: 'Email already registered' };

  const hashedPassword = await bcrypt.hash(userDto.password, 10);
  const newUser = await createUser({
    name: userDto.userName,
    email: userDto.email,
    password: hashedPassword,
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };
};

const loginService = async (userDto) => {
  const user = await findUserByEmail(userDto.email);
  if (!user) throw { status: 401, message: 'Invalid email or password' };

  const isMatch = await bcrypt.compare(userDto.password, user.password);
  if (!isMatch) throw { status: 401, message: 'Invalid email or password' };

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

module.exports = {
  signupService,
  loginService,
};
