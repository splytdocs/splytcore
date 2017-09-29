const Jwt = require("./Jwt");
const tokenizer = require("jsonwebtoken");
describe('makeUnsignedUserPayload', () => {
  it('should return user.id=id, user.name=name, user.id=sub', () => {
    const results = Jwt.makeUnsignedUserPayload({
      id:"12345",
      name:"Fakerton"
    });
    expect(results.id).toEqual("12345");
    expect(results.sub).toEqual("12345");
    expect(results.name).toEqual("Fakerton");
  });
});
describe('sign', () => {
  it('should make a token that decodes to the right outputs', () => {
    const user = {
      id:"12345",
      name:"Fakerton"
    };
    const opts = {
      secretOrKey:"test1",
      audience:"aud",
      issuer:"iss"
    };
    const signed = Jwt.sign(user, opts);
    const decoded = tokenizer.decode(signed, opts);
    expect(decoded.aud).toEqual(opts.audience);
    expect(decoded.id).toEqual(user.id);
    expect(decoded.iss).toEqual(opts.issuer);
    expect(decoded.name).toEqual(user.name);
  });
});
describe('makeAndSignUserToken', () => {
  it('should make an object with a token property with a value that decodes to the right outputs', () => {
    const user = {
      id:"12345",
      name:"Fakerton"
    };
    const opts = {
      secretOrKey:"test1",
      audience:"aud",
      issuer:"iss"
    };
    const results = Jwt.makeAndSignUserToken(user, opts);
    const decoded = tokenizer.decode(results.token, opts);
    expect(decoded.aud).toEqual(opts.audience);
    expect(decoded.id).toEqual(user.id);
    expect(decoded.iss).toEqual(opts.issuer);
    expect(decoded.name).toEqual(user.name);
  });
});