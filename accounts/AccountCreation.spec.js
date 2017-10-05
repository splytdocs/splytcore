const AccountCreation = require("./AccountCreation");
const canUserBeCreated = AccountCreation.canUserBeCreated;
const User = require("./../models/User");

describe('canUserBeCreated', () => {
  function queryWithResults(results) {
    return {exec:jest.fn(cb=>cb(null, results))};
  }
  it('should callback with null error and {canBeCreated:true} when repo returns no matching records', () => {
    const query = queryWithResults([]);
    const callback = jest.fn();
    canUserBeCreated(query)({},callback);
    expect(query.exec).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, {canBeCreated:true});
  });
  
  it('should callback with an error indicating the username already exists if query returns one record with username==username', () => {
    const username = "fakerton";
    const query = queryWithResults([{
      username,email:""
    }]);
    const callback = jest.fn();
    canUserBeCreated(query)({username},callback);
    const expected = [{
      code:"unique",
      param:"username",
      message:"This username is already in use.",
      type:"invalid_request_error"
    }];
    expect(callback).toHaveBeenCalledWith(expected, null);
  });
  
  it('should callback with an error indicating the email already exists if query returns one record with email==email', () => {
    const email = "fakerton@mailinator.com";
    const query = queryWithResults([{
      username:"",email
    }]);
    const callback = jest.fn();
    canUserBeCreated(query)({email},callback);
    const expected = [{
      code:"unique",
      param:"email",
      message:"This email address is already in use.",
      type:"invalid_request_error"
    }];
    expect(callback).toHaveBeenCalledWith(expected, null);
  });
  
});