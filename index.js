const chalk = require('chalk');

const app = require('./src/app');

// Error Handling End

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop\n');
});

module.exports = server;
