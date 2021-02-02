const status = require('http-status');
const ApiError = require('../helpers/apiError');

const isAdmin = (req, res, next) => {
  if (req.user.get('userType') === 'admin') {
    next();
  } else {
    const error = new ApiError('Access Forbidden', status.FORBIDDEN);
    next(error);
  }
};

module.exports = { isAdmin };
