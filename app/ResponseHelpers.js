module.exports.send500 = function(res, error) {
  // todo: Make this detect if the person can see 
  // full errors (dev/debug only)
  const sendFullError = true;
  const toSend = sendFullError ? error : { message: "We encountered an unexpected error, sorry." };
  res.status(500).json(toSend);
};
module.exports.send200 = function(res, output) {
  res.status(200).json(output);
};
module.exports.send404Message = function(res, message) {
  res.status(404).send(message);
}
module.exports.sendValidationError = function(res, summary) {
  res.status(400).json({ errors: summary });
}