var dotenv = require("dotenv").config();
var jwt = require("jsonwebtoken");

const jwtOptions = {
  secretOrKey: dotenv.JWT_SECRET,
  issuer: dotenv.JWT_ISSUER,
  audience: dotenv.JWT_AUDIENCE
};
module.exports.options = jwtOptions;
module.exports.sign = (toSign)=>{
  return jwt.sign(toSign, jwtOptions.secretOrKey,{
    audience:jwtOptions.audience,
    issuer:jwtOptions.issuer
  });
};
