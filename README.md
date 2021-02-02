# Node API boilerplate

An opinionated boilerplate for Node web APIs focused on separation of concerns and scalability.

## How to use

### Docker

The easiest way to get up and running is using Docker. Once the Docker CLI is installed from https://www.docker.com/get-docker.

Copy the contents from `.env.sample` to `.env`. And get all your keys and update the `.env` file. Without the environment configuration some services won't work.

Run: `docker-compose up --build`

If everything is good. Then you can access all the services,

- Basic Authentication - http://0.0.0.0:8080
- AWS Services(S3 upload, SNS service) - http://0.0.0.0:8081
- Stripe Payment - http://0.0.0.0:8082

## Features

<dl>
  <dt>Instant feedback and reload</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/nodemon">Nodemon</a> to automatically reload the server after a file change when on development mode, makes the development faster and easier.
  </dd>

  <dt>Scalable and easy to use web server</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/express">Express</a> for requests routing and middlewares. There are some essential middlewares for web APIs already setup, like <a href="https://www.npmjs.com/package/body-parser">body-parser</a>, <a href="https://www.npmjs.com/package/compression">compression</a>, <a href="https://www.npmjs.com/package/cors">CORS</a> and <a href="https://www.npmjs.com/package/method-override">method-override</a>.
  </dd>

  <dt>Database integration</dt>
  <dd>
    <a href="https://www.npmjs.com/package/sequelize">Sequelize</a>, an ORM for SQL databases, is already integrated, you just have to set the <a href="https://github.com/talyssonoc/node-api-boilerplate/wiki/Database-setup">authentication configurations</a>.
  </dd>

  <dt>Prepared for testing</dt>
  <dd>
    The test suite uses <a href="https://www.npmjs.com/package/jest">Jest</a> and is prepared to run unit, integration and functional tests right from the beginning.
  </dd>

  <dt>CLI integration</dt>
  <dd>
    Both the application and Sequelize have command-line tools to make it easy to work with them. Check the <a href="#scripts">Scripts</a> section to know more about this feature.
  </dd>

  <dt>Logging</dt>
  <dd>
    The <a href="https://www.npmjs.com/package/log4js">Log4js</a> logger is highly pluggable, being able to append the messages to a file during the development and send them to a logging service when on production. Even the requests (through <a href="https://www.npmjs.com/package/morgan">morgan</a>) and queries will be logged.
  </dd>

  <dt>Linter</dt>
  <dd>
    It's also setup with <a href="https://www.npmjs.com/package/eslint">ESLint</a> to make it easy to ensure a code styling and find code smells.
  </dd>
</dl>

## Tech

- [Node v12.16.2](http://nodejs.org/)
- [Express](https://npmjs.com/package/express)
- [Sequelize](https://www.npmjs.com/package/sequelize)
- [HTTP Status](https://www.npmjs.com/package/http-status)
- [Log4js](https://www.npmjs.com/package/log4js)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Express Status Monitor](https://www.npmjs.com/package/express-status-monitor)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [ESLint](https://www.npmjs.com/package/eslint) + [ESLint AirBnb](https://www.npmjs.com/package/eslint-config-airbnb-base) + [Prettier](https://www.npmjs.com/package/prettier)
- [Joi](https://www.npmjs.com/package/@hapi/joi)
- [Jest](https://www.npmjs.com/package/jest) + [SuperTest](https://www.npmjs.com/package/supertest)
- [Speakeasy](https://www.npmjs.com/package/speakeasy)
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)
- [Stripe](https://www.npmjs.com/package/stripe)
- [AWS](https://www.npmjs.com/package/aws-sdk) + [Multer S3](https://www.npmjs.com/package/multer-s3)
