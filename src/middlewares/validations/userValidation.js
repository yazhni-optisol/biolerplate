const Joi = require('@hapi/joi');

const userValidation = {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  register: {
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      password: Joi.string().required().min(8),
      userType: Joi.string(),
    }),
  },
  forgotPassword: {
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  },
  resetPasswordOTP: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      otpCode: Joi.string().required(),
    }),
  },
  resetPasswordEmail: {
    params: Joi.object({
      reset_password_token: Joi.string().required(),
    }),
    body: Joi.object({
      password: Joi.string().required().min(8),
    }),
  },
  verifyByEmail: {
    params: Joi.object({
      registration_token: Joi.string().required(),
    }),
  },
  verifyByOTP: {
    body: Joi.object({
      otpCode: Joi.string().required(),
      email: Joi.string().email().required(),
    }),
  },
};

module.exports = userValidation;
