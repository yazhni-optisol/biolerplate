const status = require('http-status');
const ApiError = require('../helpers/apiError');
const { UserSerializer } = require('../serializers');
const { User } = require('../models');

const UserController = {
  /**
   * Returns user if given user id is valid
   * @params {header: JWT 'token'}
   * @returns { User }
   */
  async show(req, res) {
    const user = await User.getBy({ id: req.user.id });
    const serializedUser = (await UserSerializer.serialize(user)) || {};
    res.status(status.OK).json({ user: serializedUser });
  },

  /**
   * update existing user
   * @params {header: JWT 'token'}
   * @params {string} req.body.name user name
   * @params {string} req.body.phone phone number
   * @returns {User}
   */
  async update(req, res, next) {
    let user = await User.getBy({ id: req.user.id });

    try {
      user = await user.update(req.body);
      const serializedUser = (await UserSerializer.serialize(user)) || {};
      res.status(status.OK).json({ user: serializedUser });
    } catch (err) {
      next(err);
    }
  },
  async isAuthenticatedUser(req, res, next) {
    if (req.user) {
      res.status(status.OK).json(req.user);
    } else {
      const error = new ApiError('Please Log in', status.BAD_REQUEST);
      next(error);
    }
  },
};

module.exports = UserController;
