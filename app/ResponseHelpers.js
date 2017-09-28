module.exports.send500 = function(res, error) {
  // todo: Make this detect if the person can see 
  // full errors (dev/debug only)
  const fallback = { message: "We encountered an unexpected error, sorry." };
  if(error == null) error = fallback;
  const sendFullError = true ;
  const toSend = sendFullError ? error : fallback; 
  res.status(500).json(toSend);
};
module.exports.send200 = function(res, output) {
  res.status(200).json(output);
};
module.exports.send201 = function(res, output) {
  res.status(201).json(output);
};
module.exports.send404Message = function(res, message) {
  res.status(404).send(message);
}
module.exports.sendValidationError = function(res, summary, statusCode) {
  statusCode = statusCode || 400;
  res.status(statusCode).json({ errors: summary });
};
module.exports.sendNotAuthenticated = function(res, summary) {
  const defaults = [{
    message:"401 Unauthorized",
    type:"authentication_error"
  }];
  if(summary == null) summary = defaults;
  res.status(401).json({errors:summary});
};
module.exports.sendUnauthorized = function(res, summary) {
  const defaults = [{
    message:"403 Unauthorized",
    type:"authentication_error"
  }];
  if(summary == null) summary = defaults;
  res.status(403).json({errors:summary});
};