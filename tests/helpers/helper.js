const supertest = require('supertest');
const http = require('http');
const app = require('../../src/app');

let server;

class Helper {
  constructor(token = '') {
    const createServer = (done) => {
      server = http.createServer(app);
      server.listen(done);
    };

    const hook = (method = 'post') => (args) =>
      supertest(server)[method](args).set('Authorization', `JWT ${token}`);

    const request = {
      post: hook('post'),
      get: hook('get'),
      put: hook('put'),
      delete: hook('delete'),
    };

    const close = (done) => {
      server.close(done);
    };

    this.apiServer = request;
    this.close = close;
    this.server = createServer;
  }
}

module.exports = Helper;
