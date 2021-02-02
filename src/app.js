/* eslint-disable no-unused-vars */
/**
 * Module dependencies.
 */
require('dotenv').config();
// const multer = require('multer');
const log4js = require('log4js');
const httpStatus = require('http-status');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const expressStatusMonitor = require('express-status-monitor');
const { ValidationError } = require('express-validation');
const Speakeasy = require('speakeasy');
const session = require('express-session');

const app = express();
const swaggerDocument = require('./interfaces/swagger/swagger.json');
const ApiError = require('./helpers/apiError');
const { LoggerStreamAdapter, Logger } = require('./config/logger');

const log = log4js.getLogger('app');

const { Router } = express;

// require('./src/interfaces/chat')(io);

const { authRoute, userRoute, adminRoute } = require('./routes');

app.use(helmet.xssFilter());
app.use(helmet.frameguard());

app.use(cookieParser());
app.use(compress());

/**
 * Express configuration.
 */
app.set('host', process.env.WEB_IP || '0.0.0.0');
app.set('port', process.env.WEB_PORT || 8080);
app.use(
  expressStatusMonitor({
    // websocket: io,
    port: app.get('port'),
  }),
);
app.use(compression());
app.use(cors());
// app.use(logger('dev'));
app.use(logger('dev', { stream: LoggerStreamAdapter.toStream(Logger) }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.disable('x-powered-by');

const apiRouter = Router();

apiRouter.use('/auth', authRoute.router);
apiRouter.use('/user', userRoute.router);
apiRouter.use('/admin', adminRoute.router);
apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', apiRouter);

// Error Handling Start

app.use((err, req, res, next) => {
  // log.error('Something went wrong:', err);
  if (err instanceof ValidationError) {
    const error = new ApiError(err, httpStatus.BAD_REQUEST);
    return next(error);
  }
  if (!(err instanceof ApiError)) {
    const apiError = new ApiError(err.message, err.status);
    return next(apiError);
  }
  return next(err);
});

// 404
app.use((req, res, next) => {
  const err = new ApiError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    log.error('Something went wrong:', err);
  }
  res.status(err.status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

module.exports = app;
