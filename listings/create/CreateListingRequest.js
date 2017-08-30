const Envelope = require("./../app/ErrorResponseEnvelope").ErrorResponseEnvelope;
const Error = require("./../app/SingleErrorResponse").SingleErrorResponse;
const SchemaValidator = new AjvCreateListingSchemaValidator();
module.exports.validateSchemaForApi = (input)=> {
  const errors = [];
  if (input == null) {
    errors.push(new Error({
      code: "listing_request_missing",
      param: "*",
      message: "The listing request body was missing.",
      type:"invalid_request_error"
    }));
    return new Envelope(errors);
  }
};

class AjvCreateListingSchemaValidator {
  constructor() {

  }
  validate(input) {

  }
  toError()
}