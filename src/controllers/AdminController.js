const status = require('http-status');
const { User } = require('../models');
const { UserSerializer } = require('../serializers');

const AdminController = {
  /**
   * @params {header: JWT 'token'}
   * @returns {Users}
   */
  async users(req, res) {
    let users = await User.getAll();

    if (users.length === 0) {
      res.status(status.OK).json({ users });
    } else {
      users = users.map((user) => UserSerializer.serialize(user));
      res.status(status.OK).json({ users });
    }
  },

  /**
   * @params {header: JWT 'token'}
   * @params {int} req.params.id userId
   * @returns {User}
   */
  async show(req, res) {
    const user = await User.getBy({ id: req.params.id });
    if (!user) {
      res.status(status.NOT_FOUND).json({ message: 'User not found.' });
    } else {
      const serializedUser = UserSerializer.serialize(user);
      res.status(status.OK).json({ user: serializedUser });
    }
  },

  /**
   * update existing user
   * @params {header: JWT 'token'}
   * @params {string} req.body.name user name
   * @params {string} req.body.phone phone number
   * @returns {User}
   */
  async update(req, res) {
    let user = await User.getBy({ id: req.params.id });
    if (!user) {
      res.status(status.NOT_FOUND).json({ message: 'User not found.' });
    } else {
      user = await user.update(req.body);
      const serializedUser = UserSerializer.serialize(user);
      res.status(status.OK).json({ user: serializedUser });
    }
  },

  /**
   * @params {header: JWT 'token'}
   * @params {string} req.params.id
   * @returns {}
   */
  async delete(req, res) {
    let user = await User.getBy({ id: req.params.id });
    if (!user) {
      res.status(status.NOT_FOUND).json({ message: 'User not found.' });
    } else {
      user = await user.update({ isDeleted: true });
      const serializedUser = UserSerializer.serialize(user);
      res.status(status.OK).json({ user: serializedUser });
    }
  },
};

module.exports = AdminController;
