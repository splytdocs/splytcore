var Rollbar = require('rollbar');

module.exports.register = (expressApp, env=process.env) => {
  if(env.rollbar_token) {
    console.log("Registering Rollbar")
    const rollbar = new Rollbar(env.rollbar_token);
    expressApp.use(rollbar.errorHandler())
  }
};