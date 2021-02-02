const { Router } = require('express');
const { validate } = require('express-validation');
const { AdminController } = require('../controllers');
const passportConfig = require('../config/passport');
const checkAdmin = require('../middlewares/checkAdmin');
const { adminValidation } = require('../middlewares/validations');

const adminRoute = {
  get router() {
    const router = Router();

    router.get('/users', passportConfig.isAuthenticated, checkAdmin.isAdmin, AdminController.users);

    router
      .route('/users/:id')
      .get(passportConfig.isAuthenticated, checkAdmin.isAdmin, AdminController.show)
      .put(
        validate(adminValidation.updateUser, { keyByField: true }, { abortEarly: false }),
        passportConfig.isAuthenticated,
        checkAdmin.isAdmin,
        AdminController.update,
      )
      .delete(passportConfig.isAuthenticated, checkAdmin.isAdmin, AdminController.delete);

    return router;
  },
};

module.exports = adminRoute;
