const helpers = require("./../app/ResponseHelpers");
const send500 = helpers.send500,
  send200 = helpers.send200;
const ethereum = require("./ethereum.js");

exports.getAddresses = function(req, res) {
  const output = ethereum.addresses;
  return send200(res, output);
};
