const helpers = require("./ResponseHelpers");
const mockRes = require('jest-mock-express').response;

describe('send500', () => {
  it('should call res.status(500).json({error})', () => {
    const res = mockRes();
    const error = "mock error";
    helpers.send500(res, error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
describe('send200', () => {
  it('should call res.status(200).json({payload})', () => {
    const res = mockRes();
    const payload = {test:"1"};
    helpers.send200(res, payload);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(payload);
  });
});
describe('send404Message', () => {
  it('should call res.status(404).send(message)', () => {
    const res = mockRes();
    const message = "Object 7 not found.";
    helpers.send404Message(res, message);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(message);
  });
});
describe('sendValidationError', () => {
  it('should call res.status(400).json({errors:input})', () => {
    const res = mockRes(), summary = [{message:"whatever"}];
    helpers.sendValidationError(res, summary);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({errors:summary});
  });
});