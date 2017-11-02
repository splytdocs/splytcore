var raygun = require('raygun');

module.exports.register = (expressApp, env=process.env) => {
  if(env.raygun_token) {
    console.log("Registering Raygun")
    var raygunClient = new raygun.Client().init({ apiKey: env.raygun_token });
    expressApp.use(raygunClient.expressHandler);
  }
};