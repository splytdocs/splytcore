const AjvSchemaValidator = require("./AjvSchemaValidator").AjvSchemaValidator;const ser = require("./SingleErrorResponse");
const SingleErrorResponse = ser.SingleErrorResponse;
const InvalidRequestError = ser.InvalidRequestError;
const Ajv = require("ajv");

describe('AjvSchemaValidator', () => {
  describe('constructor', () => {
    function expectToThrowMissingSchemaError(options) {
      expect(()=>{new AjvSchemaValidator(options)})
        .toThrowError("`options.schema` is required");
    };
    it('should throw an exception when options.schema is null', () => {
      expectToThrowMissingSchemaError({schema:null});
    });
    it('should throw an exception when options.schema is undefined', () => {
      expectToThrowMissingSchemaError({});
    });
    it('should throw an exception when options is undefined', () => {
      expectToThrowMissingSchemaError();
    });
    it('should default this.ajv to instance of Ajv', () => {
      const underTest = new AjvSchemaValidator({
        schema:{}
      });
      expect(underTest.ajv).toBeInstanceOf(Ajv);
    });
  });
  describe('validate mocked', () => {
    it('calls ajv.validate with schema and input', () => {
      const input = {x:"y"};
      const mockAjv = {validate:jest.fn()};
      const underTest = new AjvSchemaValidator({schema:{}});
      underTest.ajv = mockAjv;
      //underTest.ajv.validate(underTest.schema, input);
      underTest.validate(input);
      expect(mockAjv.validate)
        .toHaveBeenCalledWith(underTest.schema, input);
    });
  });
});