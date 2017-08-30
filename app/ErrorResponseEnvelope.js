class ErrorResponseEnvelope {
  constructor(errors) {
    Object.assign(this, {
      errors: errors || []
    });
  }
}
module.exports.ErrorResponseEnvelope = ErrorResponseEnvelope;