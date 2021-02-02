const status = require('http-status');
const bcrypt = require('bcrypt');
const ApiError = require('../helpers/apiError');
const jwtGenerator = require('../middlewares/jwtGenerator');
const { User } = require('../models');
const { UserSerializer } = require('../serializers');
const authService = require('../services/authService');

const AuthController = {
  /**
   * Create new user
   * @params {string} req.body.email
   * @params {string} req.body.username
   * @params {string} req.body.phone
   * @params {string} req.body.password
   * @returns {User}
   */
  async register(req, res, next) {
    const userData = req.body;
    const userExist = await User.getBy({ email: userData.email });
    if (userExist) {
      const err = new ApiError('Email already exist', status.BAD_REQUEST);
      next(err);
    } else {
      try {
        authService.createUser(userData, (userDetail, error) => {
          if (error) {
            next(error);
          } else {
            res.status(status.CREATED).json({ user: UserSerializer.serialize(userDetail) });
          }
        });
      } catch (err) {
        next(err);
      }
    }
  },
  /** Verify user after new user created
   * @params {string} req.params.registrationToken
   */
  async verifyRegisteredUserEmail(req, res, next) {
    const user = await User.getBy({
      registrationToken: req.params.registration_token,
    });
    if (user) {
      if (!user.isVerified) {
        await user.update({ isVerified: true, registrationToken: null });
        res.status(status.OK).json({ message: 'User verified Successfully.' });
      } else {
        res.status(status.OK).json({ message: 'User already verified.' });
      }
    } else {
      const error = new ApiError('Invalid Token', status.BAD_REQUEST);
      next(error);
    }
  },
  async verifyRegisteredUserOTP(req, res, next) {
    const user = await User.getBy({ email: req.body.email });
    if (!user) {
      const error = new ApiError("Email doesn't exist", status.BAD_REQUEST);
      next(error);
    }
    if (!user.isVerified) {
      authService.verifyOTP(user, req.body.otpCode, (userDetail, error) => {
        if (error) {
          next(error);
        } else {
          res.status(status.OK).json({ message: 'User verified Successfully.' });
        }
      });
    } else {
      res.status(status.OK).json({ message: 'User already verified.' });
    }
  },
  /**
   * Returns jwt token if valid email and password is provided
   * @params {string} req.body.email
   * @params {string} req.body.password
   * @returns { token }
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.getBy({ email });
      if (!user) {
        const error = new ApiError('User not found', status.NOT_FOUND);
        next(error);
      }
      if (!user.isVerified) {
        const error = new ApiError('User is not verified', status.BAD_REQUEST);
        next(error);
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        const error = new ApiError('Password mismatch', status.UNAUTHORIZED);
        next(error);
      }
      const token = await jwtGenerator.token(user);
      res.status(status.OK).json({ token });
    } catch (error) {
      next(error);
    }
  },

  /**
   * if given email is valid then the forget password email will send.
   * @params {string} req.body.email - user email
   * @returns Email will send
   */
  async forgotPassword(req, res, next) {
    const user = await User.getBy({ email: req.body.email });
    if (user) {
      try {
        authService.forgotPassword(user, (userData, error) => {
          if (error) {
            next(error);
          } else {
            res.status(status.OK).json({ message: 'Reset password email sent successfully' });
          }
        });
      } catch (error) {
        next(error);
      }
    } else {
      const error = new ApiError("Email doesn't exist", status.NOT_FOUND);
      next(error);
    }
  },

  /** Reset password with otpCode
   * @params {string} req.body.email
   * @params {string} req.body.otpCode
   * @returns {Success}
   */
  async resetPasswordByEmail(req, res, next) {
    const user = await User.getBy({
      resetPasswordToken: req.params.reset_password_token,
    });
    if (user) {
      const params = {
        password: req.body.password,
      };
      authService.resetPassword(user, params, (success, error) => {
        if (error) {
          next(error);
        } else {
          res.status(status.OK).json({ message: 'Password updated Successfully.' });
        }
      });
    } else {
      const error = new ApiError('Invalid Token', status.BAD_REQUEST);
      next(error);
    }
  },

  /** Reset password with otpCode
   * @params {string} req.body.email
   * @params {string} req.body.otpCode
   * @returns {Success}
   */
  async resetPasswordByOTP(req, res, next) {
    const { password, otpCode, email } = req.body;
    const user = await User.getBy({ email });
    if (user) {
      authService.resetPasswordByOTP(user, { password, otpCode }, (success, error) => {
        if (error) {
          next(error);
        } else {
          res.status(status.OK).json({ message: 'Password updated Successfully.' });
        }
      });
    } else {
      const error = new ApiError("Email doesn't exist", status.BAD_REQUEST);
      next(error);
    }
  },
};

module.exports = AuthController;
