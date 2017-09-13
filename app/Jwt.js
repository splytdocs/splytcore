var dotenv = require("dotenv").config();
var jwt = require("jsonwebtoken");

const jwtOptions = {
  secretOrKey: dotenv.JWT_SECRET,
  issuer: dotenv.JWT_ISSUER,
  audience: dotenv.JWT_AUDIENCE
};
function makeUnsignedUserPayload(user) {
  const payload = {
    id:user.id,
    name:user.name,
    sub:user.id
  };
  return payload;
};
function makeAndSignUserToken(user) {
  const toSign = makeUnsignedUserPayload(user);
  return {token:sign(toSign)};
};
function sign(toSign) {
  return jwt.sign(toSign, jwtOptions.secretOrKey,{
    audience:jwtOptions.audience,
    issuer:jwtOptions.issuer
  });
};
module.exports.options = jwtOptions;
module.exports.sign = sign;
module.exports.makeUnsignedUserPayload = makeUnsignedUserPayload; 
module.exports.makeAndSignUserToken = makeAndSignUserToken;