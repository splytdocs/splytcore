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
  it('should give standard error if error not passed', () => {
    const res = mockRes();
    const expected = { message: "We encountered an unexpected error, sorry." };
    helpers.send500(res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expected);
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
describe('send201', () => {
  it('should call res.status(201).json({payload})', () => {
    const res = mockRes();
    const payload = {test:"1"};
    helpers.send200(res, payload);
    expect(res.status).toHaveBeenCalledWith(201);
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
  it('should call res.status(402).json({errors:input}) when given custom statusCode', () => {
    const res = mockRes(), summary = [{message:"whatever"}];
    helpers.sendValidationError(res, summary, 402);
    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith({errors:summary});
  });
});
describe('sendNotAuthenticated', () => {
  it('should call res.status(401).json(defaults) by default', () => {
    const res = mockRes();
    helpers.sendNotAuthenticated(res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({errors:[{
      type:"authentication_error",
      message:"401 Unauthorized"
    }]});
  });
  it('should call res.status(401).json({errors:summary})', () => {
    const res = mockRes(), summary = [{message:"Whatever"}];
    helpers.sendNotAuthenticated(res, summary);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({errors:summary});
  });
});
describe('sendUnauthorized', () => {
  it('should call res.status(403).json(defaults) by default', () => {
    const res = mockRes();
    helpers.sendUnauthorized(res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({errors:[{
      type:"authentication_error",
      message:"403 Unauthorized"
    }]});
  });
  it('should call res.status(403).json({errors:summary})', () => {
    const res = mockRes(), summary = [{message:"Whatever"}];
    helpers.sendUnauthorized(res, summary);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({errors:summary});
  });
});