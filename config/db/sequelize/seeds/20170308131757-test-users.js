const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const testUsers = [];

    testUsers.push({
      name: 'Admin',
      email: 'admin@example.com',
      password: await this.hashedPassword('password'),
      isDeleted: false,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userType: 'admin',
    });
    testUsers.push({
      name: 'Stephen M',
      email: 'stephen.m@optisolbusiness.com',
      password: await this.hashedPassword('password'),
      isDeleted: false,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return queryInterface.bulkInsert('Users', testUsers, {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  },

  async hashedPassword(password) {
    const salt = await bcrypt.genSalt(15);
    const pw = await bcrypt.hash(password, salt);

    return pw;
  },
};
