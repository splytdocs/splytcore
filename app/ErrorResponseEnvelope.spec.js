var ErrorResponseEnvelope = require("./ErrorResponseEnvelope").ErrorResponseEnvelope;
describe('constructor', () => {
  describe('defaults', () => {
    it('should set `errors` to an empty array', () => {
      const underTest = new ErrorResponseEnvelope();
      expect(underTest.errors).toEqual([]);
    });
  });
  describe('one parameter', () => {
    it('should set errors to passed parameter', () => {
      const expected = [{},{}];
      const underTest = new ErrorResponseEnvelope(expected);
      expect(underTest.errors).toBe(expected);
    });
    it('should set `errors` to empty array when passed null', () => {
      const underTest = new ErrorResponseEnvelope(null);
      expect(underTest.errors).toEqual([]);
    });
  });
});