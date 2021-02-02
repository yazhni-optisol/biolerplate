module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      subscriptionId: {
        type: Sequelize.INTEGER,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      stripeCustomerId: Sequelize.STRING,
      otpCode: Sequelize.STRING,
      secret: Sequelize.STRING,
      userType: {
        type: Sequelize.ENUM,
        defaultValue: 'user',
        values: ['admin', 'user'],
      },

      twitter: Sequelize.STRING,
      google: Sequelize.STRING,
      github: Sequelize.STRING,
      linkedin: Sequelize.STRING,
      facebook: Sequelize.STRING,

      tokens: Sequelize.TEXT,

      registrationToken: Sequelize.STRING,
      resetPasswordToken: Sequelize.STRING,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Users');
  },
};
