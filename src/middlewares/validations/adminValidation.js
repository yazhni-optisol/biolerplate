const Joi = require('@hapi/joi');

const adminValidation = {
  updateUser: {
    body: Joi.object({
      name: Joi.string(),
    }),
  },
};

module.exports = adminValidation;
