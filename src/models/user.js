const crypto = require('crypto');
const { bcryptPassword } = require('../services/password');
const OTP = require('../config/otp');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Email format is Invalid.',
        },
      },
    },
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    stripeCustomerId: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
    isVerified: DataTypes.BOOLEAN,
    userType: {
      type: DataTypes.ENUM,
      values: ['admin', 'user'],
    },

    otpCode: DataTypes.STRING,
    secret: DataTypes.STRING,

    subscriptionId: DataTypes.INTEGER,
    twitter: DataTypes.STRING,
    google: DataTypes.STRING,
    github: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    facebook: DataTypes.STRING,

    tokens: DataTypes.TEXT,
    registrationToken: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
  });

  User.getAll = async () => {
    const users = await User.findAll({ where: { isDeleted: false } });

    return users;
  };

  User.getBy = async (attr) => {
    const user = await User.findOne({ where: { ...attr } });

    return user;
  };

  User.createInstance = async (userData) => {
    const newUser = await User.create(userData);

    return newUser;
  };

  User.prototype.updateInstance = async (id, args) => {
    const user = await User.update(args, { where: { id } });

    return user;
  };

  User.beforeCreate(async (user) => {
    const userData = user;
    await bcryptPassword(userData.password, (encPassword) => {
      userData.password = encPassword;
    });
    userData.registrationToken = await crypto.randomBytes(64).toString('hex');
    await OTP.otpCode((response) => {
      userData.otpCode = response.otpCode;
      userData.secret = response.secret;
    });
  });

  return User;
};
