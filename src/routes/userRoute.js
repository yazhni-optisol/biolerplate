const { Router } = require('express');
const { UserController } = require('../controllers');
const passportConfig = require('../config/passport');

const userRoute = {
  get router() {
    const router = Router();
    router
      .get('/', passportConfig.isAuthenticated, UserController.show)
      .put('/', passportConfig.isAuthenticated, UserController.update);
    router.get(
      '/authenticated_user',
      passportConfig.isAuthenticated,
      UserController.isAuthenticatedUser,
    );

    return router;
  },
};

module.exports = userRoute;
