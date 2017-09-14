var dotenv = require("dotenv").config();
var jwt = require("jsonwebtoken");

const jwtOptions = {
  secretOrKey: dotenv.JWT_SECRET,
  issuer: dotenv.JWT_ISSUER,
  audience: dotenv.JWT_AUDIENCE
};
function makeUnsignedUserPayload(user) {
  return {
    id:user.id,
    name:user.name,
    sub:user.id
  };
};
function makeAndSignUserToken(user, options) {
  const toSign = makeUnsignedUserPayload(user);
  return {token:sign(toSign, options)};
};
function sign(toSign, options) {
  options = options || jwtOptions;
  return jwt.sign(toSign, options.secretOrKey, {
    audience:options.audience,
    issuer:options.issuer
  });
};
module.exports.options = jwtOptions;
module.exports.sign = sign;
module.exports.makeUnsignedUserPayload = makeUnsignedUserPayload; 
module.exports.makeAndSignUserToken = makeAndSignUserToken;