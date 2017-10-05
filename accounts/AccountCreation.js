const UserModel = require('./../models/User');
const SingleErrorResponse = require("./../app/SingleErrorResponse");
const makeError = SingleErrorResponse.InvalidRequestError;
const uniqueCode = SingleErrorResponse.codes.unique;
const _ = require("lodash");

module.exports.sanitizeAndCreate = (User=UserModel)=>(userDoc, callback)=>{
  User.create(userDoc, callback)
};
module.exports.usernameOrEmailExistsQuery = (User=UserModel)=>({username, email})=>{
  return User.find({})
    .select('email username')
    .or({username})
    .or({email})
    .limit(2);
};
module.exports.canUserBeCreated = (query=null) => ({username, email}, callback)=>{
  query = query || this.usernameOrEmailExistsQuery()({username, email});
  const errors = [];
  query.exec((err, matchingUsers)=>{
    if(matchingUsers && matchingUsers.length) {
      if(matchingUsers.find((i)=>i.username==username)) {
        errors.push(makeError({
          code:uniqueCode,
          param:"username",
          message:"This username is already in use."
        }));
      }
      if(matchingUsers.find((i)=>i.email==email)) {
        errors.push(makeError({
          code:uniqueCode,
          param:"email",
          message:"This email address is already in use."
        }));
      }
      return callback(errors, null);
    } else {
      return callback(null, {canBeCreated:true})
    }
    callback(errors);
  });
};