const status = require('http-status');
const { Router } = require('express');
const { validate } = require('express-validation');
const passport = require('passport');
const { AuthController } = require('../controllers');
const { userValidation } = require('../middlewares/validations');

const authRoute = {
  get router() {
    const router = Router();
    router.post(
      '/register',
      validate(userValidation.register, { keyByField: true }, { abortEarly: false }),
      AuthController.register,
    );
    router.post(
      '/login',
      validate(userValidation.login, { keyByField: true }, { abortEarly: false }),
      AuthController.login,
    );
    router.post(
      '/forgot_password',
      validate(userValidation.forgotPassword, { keyByField: true }, { abortEarly: false }),
      AuthController.forgotPassword,
    );
    router.post(
      '/reset_password_email/:reset_password_token',
      validate(userValidation.resetPasswordEmail, { keyByField: true }, { abortEarly: false }),
      AuthController.resetPasswordByEmail,
    );
    router.post(
      '/reset_password_otp',
      validate(userValidation.resetPasswordOTP, { keyByField: true }, { abortEarly: false }),
      AuthController.resetPasswordByOTP,
    );
    router.post(
      '/verify_email/:registration_token',
      validate(userValidation.verifyByEmail, { keyByField: true }, { abortEarly: false }),
      AuthController.verifyRegisteredUserEmail,
    );
    router.post(
      '/verify_otp',
      validate(userValidation.verifyByOTP, { keyByField: true }, { abortEarly: false }),
      AuthController.verifyRegisteredUserOTP,
    );

    router.get(
      '/facebook',
      passport.authenticate('facebook', {
        scope: ['email'],
      }),
    );

    router.get(
      '/facebook/callback',
      passport.authenticate('facebook', {
        scope: ['email'],
        failureRedirect: '/',
      }),
      (req, res) => {
        const token = req.user.jwtToken;
        res.status(status.OK).json({ token });
      },
    );

    router.get('/linkedin', passport.authenticate('linkedin'));

    router.get(
      '/linkedin/callback',
      passport.authenticate('linkedin', { failureRedirect: '/' }),
      (req, res) => {
        const token = req.user.jwtToken;
        res.status(status.OK).json({ token });
      },
    );

    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get(
      '/google/callback',
      passport.authenticate('google', {
        scope: ['profile', 'email'],
        failureRedirect: '/',
      }),
      (req, res) => {
        const token = req.user.jwtToken;
        res.status(status.OK).json({ token });
      },
    );

    router.get('/twitter', passport.authenticate('twitter'));

    router.get(
      '/twitter/callback',
      passport.authenticate('twitter', { failureRedirect: '/' }),
      (req, res) => {
        const token = req.user.jwtToken;
        res.status(status.OK).json({ token });
      },
    );

    return router;
  },
};

module.exports = authRoute;
