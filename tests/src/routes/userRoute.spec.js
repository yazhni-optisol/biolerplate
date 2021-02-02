const Helper = require('../../helpers/helper');
const { User } = require('../../../src/models');
const UserFactory = require('../../factories/user.factory');

let helper = new Helper();

const USER_ENDPOINT = '/api/user';

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
 * @test {userRoutes.js}
 */
describe(`${USER_ENDPOINT}`, () => {
  beforeAll(async () => {
    await User.sync({ force: true });
    testUser = await User.create(UserFactory.generate({ isVerified: true }));
    const res = await helper.apiServer.post(`/api/auth/login`).send({
      email: testUser.email,
      password: 'password1',
    });
    helper = new Helper(res.body.token);
  });
  describe(`GET ${USER_ENDPOINT}`, () => {
    it('should get the user details', async () => {
      const res = await helper.apiServer.get(USER_ENDPOINT);
      const { status, body } = res;
      expect(status).toEqual(200);
      expect(body).toHaveProperty('user');
      expect(body.user.name).toEqual(testUser.name);
    });
  });
  describe(`PUT ${USER_ENDPOINT}`, () => {
    it('should update the details for logged in user', async () => {
      const res = await helper.apiServer.put(USER_ENDPOINT).send({
        name: 'Test User',
      });
      const { status, body } = res;
      expect(status).toEqual(200);
      expect(body).toHaveProperty('user');
      expect(body.user.name).toEqual('Test User');
    });
  });
});
