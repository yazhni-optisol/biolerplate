const crypto = require('crypto');
const status = require('http-status');
const ApiError = require('../helpers/apiError');
const OTP = require('../config/otp');
const { User } = require('../models');
const { bcryptPassword } = require('./password');

const authService = {
  async createUser(user, done) {
    const userData = user;
    const newUser = await User.createInstance(userData);
    const userDetail = newUser.dataValues ? newUser : newUser.attributes;

    done(userDetail, false);
  },
  verifyOTP(userObj, otpCode, done) {
    const user = userObj;
    if (user.otpCode !== otpCode) {
      const err = new ApiError('Invalid OTP', status.UNAUTHORIZED);
      done(null, err);
    } else {
      OTP.verifyOTP({ otpCode, secret: user.secret }, async (isVerified, error) => {
        if (error) {
          const err = new ApiError(error.message, status.UNAUTHORIZED);
          done(null, err);
        }
        if (isVerified) {
          await user.update({ isVerified, otpCode: null });
          done(true, false);
        } else {
          const err = new ApiError('OTP has expired', status.UNAUTHORIZED);
          done(null, err);
        }
      });
    }
  },
  async forgotPassword(userObj, done) {
    const user = userObj;
    const params = {};
    params.resetPasswordToken = await crypto.randomBytes(64).toString('hex');
    await OTP.otpCode((response) => {
      params.otpCode = response.otpCode;
      params.secret = response.secret;
    });
    const userData = await user.updateInstance(user.id, params);
    done(userData, false);
  },
  async resetPassword(user, params, done) {
    try {
      let { password } = params;
      await bcryptPassword(password, (encPassword) => {
        password = encPassword;
      });
      const userParams = {
        password,
        resetPasswordToken: null,
        otpCode: null,
        secret: null,
      };
      await user.updateInstance(user.id, userParams);
      done(true, false);
    } catch (error) {
      done(true, error);
    }
  },
  async resetPasswordByOTP(user, params, done) {
    try {
      let { password } = params;
      const { otpCode } = params;

      if (user.otpCode !== otpCode) {
        const err = new ApiError('Invalid OTP', status.UNAUTHORIZED);
        done(null, err);
      } else {
        OTP.verifyOTP({ otpCode, secret: user.secret }, async (isVerified, error) => {
          if (error) {
            const err = new ApiError(error.message, status.UNAUTHORIZED);
            done(null, err);
          }
          if (isVerified) {
            await bcryptPassword(password, (encPassword) => {
              password = encPassword;
            });
            const userParams = {
              password,
              resetPasswordToken: null,
              otpCode: null,
              secret: null,
            };
            await user.updateInstance(user.id, userParams);
            done(true, false);
          } else {
            const err = new ApiError('OTP has expired', status.UNAUTHORIZED);
            done(null, err);
          }
        });
      }
    } catch (error) {
      done(true, error);
    }
  },
};

module.exports = authService;
