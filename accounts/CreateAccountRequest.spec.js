const CreateAccountRequest = require("./CreateAccountRequest");
const validator = CreateAccountRequest.validator;
describe('validate', () => {
  function validSample() {
    return {
      "email":"test@test.com",
      "username":"tester",
      "password":"abcdefg",
      "name":"Fake Person",
      "address":"2 Sunset Blvd, Los Angeles, CA",
      "phone":"(123) 456-7890"
    };
  };
  describe('holistic', () => {
    it(`should have no errors when given a valid object`, ()=> {
      const input = validSample();
      const results = validator.validate(input);
      expect(results.length).toEqual(0);
    });
  });
  describe('email', () => {
    it('should be required', () => {
      const input = validSample();
      delete input.email;
      const results = validator.validate(input);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"required",
        param:"email",
        type:"invalid_request_error",
        message:"should have required property 'email'"
      });
    });
    it('should be an email address', () => {
      const input = validSample();
      input.email = "notanemail";
      const results = validator.validate(input);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"format",
        param:".email",
        type:"invalid_request_error",
        message:'should match format "email"'
      });
    });
  });
  describe('username', () => {
    it('should be required', () => {
      const input = validSample();
      delete input.username;
      const results = validator.validate(input);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"required",
        param:"username",
        type:"invalid_request_error",
        message:"should have required property 'username'"
      });
    });
  });
  describe('password', () => {
    it('should be required', () => {
      const input = validSample();
      delete input.password;
      const results = validator.validate(input);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"required",
        param:"password",
        type:"invalid_request_error",
        message:"should have required property 'password'"
      });
    });
  });
  describe('name', () => {
    it('should be required', () => {
      const input = validSample();
      delete input.name;
      const results = validator.validate(input);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"required",
        param:"name",
        type:"invalid_request_error",
        message:"should have required property 'name'"
      });
    });
  });
  describe('address', () => {
    it('should be required', () => {
      const input = validSample();
      delete input.address;
      const results = validator.validate(input);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"required",
        param:"address",
        type:"invalid_request_error",
        message:"should have required property 'address'"
      });
    });
  });
  describe('phone', () => {
    it('should be required', () => {
      const input = validSample();
      delete input.phone;
      const results = validator.validate(input);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"required",
        param:"phone",
        type:"invalid_request_error",
        message:"should have required property 'phone'"
      });
    });
  });
});