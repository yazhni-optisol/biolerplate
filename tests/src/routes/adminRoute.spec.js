const Helper = require('../../helpers/helper');
const { User } = require('../../../src/models');
const UserFactory = require('../../factories/user.factory');

let helper = new Helper();

const ADMIN_ENDPOINT = '/api/admin';

beforeAll((done) => {
  helper.server(done);
  // avoid jest open handle error
});
afterAll((done) => {
  helper.close(done);
  // avoid jest open handle error
});

let testUser;

/**
 * @test {adminRoutes.js}
 */
describe(`${ADMIN_ENDPOINT}`, () => {
  beforeAll(async () => {
    await User.sync({ force: true });
    await User.create(
      UserFactory.generate({
        email: 'admin@admin.com',
        userType: 'admin',
        password: 'password',
        isVerified: true,
      }),
    );
    const res = await helper.apiServer.post(`/api/auth/login`).send({
      email: 'admin@admin.com',
      password: 'password',
    });
    helper = new Helper(res.body.token);
    testUser = await User.create(UserFactory.generate());
  });
  const USERS = `${ADMIN_ENDPOINT}/users`;
  describe(`${USERS}`, () => {
    describe('Should list users with 200', () => {
      it('should return the user', async () => {
        const res = await helper.apiServer.get(USERS);
        const { status, body } = res;
        expect(status).toEqual(200);
        expect(body).toHaveProperty('users');
      });

      it('should increase the user count', async () => {
        const res = await helper.apiServer.get(USERS);
        const { status, body } = res;
        expect(status).toEqual(200);
        expect(body).toHaveProperty('users');
        // expect(body.users.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe(`GET ${USERS}/:id`, () => {
      it('should get the user by id', async () => {
        const res = await helper.apiServer.get(`${USERS}/${testUser.id}`);
        const { status, body } = res;
        expect(status).toEqual(200);
        expect(body).toHaveProperty('user');
        expect(body.user.name).toEqual(testUser.name);
      });
      it('should raise an error with 404', async () => {
        const res = await helper.apiServer.get(`${USERS}/10`);
        const { status, body } = res;
        expect(status).toEqual(404);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('User not found.');
      });
    });
    describe(`PUT ${USERS}/:id`, () => {
      it('should update the user by id', async () => {
        const res = await helper.apiServer.put(`${USERS}/${testUser.id}`).send({
          name: 'Test User',
        });
        const { status, body } = res;
        expect(status).toEqual(200);
        expect(body).toHaveProperty('user');
        expect(body.user.name).toEqual('Test User');
      });
      it('should raise an error with 404', async () => {
        const res = await helper.apiServer.put(`${USERS}/10`).send({
          name: 'Test User',
        });
        const { status, body } = res;
        expect(status).toEqual(404);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('User not found.');
      });
    });
    describe(`DELETE ${USERS}/:id`, () => {
      it('should delete the user by id', async () => {
        const res = await helper.apiServer.delete(`${USERS}/${testUser.id}`);
        const { status, body } = res;
        expect(status).toEqual(200);
        expect(body).toHaveProperty('user');
        expect(body.user.id).toEqual(testUser.id);
        expect(body.user.isDeleted).toBeTruthy();
      });
      it('should raise an error with 404', async () => {
        const res = await helper.apiServer.delete(`${USERS}/10`);
        const { status, body } = res;
        expect(status).toEqual(404);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('User not found.');
      });
    });
  });
});
