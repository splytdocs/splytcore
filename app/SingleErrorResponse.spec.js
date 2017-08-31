const ser = require("./SingleErrorResponse");
const SingleErrorResponse = ser.SingleErrorResponse;
const InvalidRequestError = ser.InvalidRequestError;
describe('constructor', () => {
  describe('defaults', () => {
    it('should set `code` to an empty string', () => {
      const underTest = new SingleErrorResponse();
      expect(underTest.code).toEqual("");
    });
    it('should set `param` to an empty string', () => {
      const underTest = new SingleErrorResponse();
      expect(underTest.param).toEqual("");
    });
    it('should set `message` to an empty string', () => {
      const underTest = new SingleErrorResponse();
      expect(underTest.message).toEqual("");
    });
    it('should set `type` to an empty string', () => {
      const underTest = new SingleErrorResponse();
      expect(underTest.type).toEqual("");
    });
  });
  describe('document parameter', () => {
    it('should set normal defaults if null', () => {
      const underTest = new SingleErrorResponse(null);
      expect(underTest.code).toEqual("");
      expect(underTest.type).toEqual("");
      expect(underTest.param).toEqual("");
      expect(underTest.message).toEqual("");
    });
    it('should set `code` to `document.code`', () => {
      const underTest = new SingleErrorResponse({
        code:"abcdef"
      });
      expect(underTest.code).toEqual("abcdef");
    });
    it('should set `param` to `document.param`', () => {
      const underTest = new SingleErrorResponse({
        param:"abcdef"
      });
      expect(underTest.param).toEqual("abcdef");
    });
    it('should set `type` to `document.type`', () => {
      const underTest = new SingleErrorResponse({
        type:"abcdef"
      });
      expect(underTest.type).toEqual("abcdef");
    });
    it('should set `message` to `document.message`', () => {
      const underTest = new SingleErrorResponse({
        message:"abcdef"
      });
      expect(underTest.message).toEqual("abcdef");
    });
    it('should assign arbitrary fields too', () => {
      const underTest = new SingleErrorResponse({
        abcdef:"ghijkl"
      });
      expect(underTest.abcdef).toEqual("ghijkl");
    });
  });
  describe('InvalidRequestError', () => {
    it('should create a SingleErrorResponse with `type` equal to `invalid_request_error`', () => {
      const underTest = InvalidRequestError();
      expect(underTest.type).toEqual("invalid_request_error"); 
    });
    it('should create a SingleErrorResponse with `type` equal to `invalid_request_error` and assigned properties', () => {
      const underTest = InvalidRequestError({
        message:"Whatever"
      });
      expect(underTest.type).toEqual("invalid_request_error"); 
      expect(underTest.message).toEqual("Whatever"); 
      expect(underTest.param).toEqual("");
      expect(underTest.code).toEqual("");
    });
  });
});