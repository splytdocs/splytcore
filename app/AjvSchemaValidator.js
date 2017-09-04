const ser = require("./SingleErrorResponse");
const SingleErrorResponse = ser.SingleErrorResponse;
const InvalidRequestError = ser.InvalidRequestError;
const Ajv = require("ajv");

class AjvSchemaValidator {
  constructor(options) {
    if(!options || !options.schema) {
      throw "`options.schema` is required";
    }
    this.ajv = options.ajv || new Ajv({allErrors:true});
    this.schema = options.schema;
  }
  validate(input) {
    const summary = this.ajv.validate(this.schema, input);
    if(summary) return [];
    const errors = this.ajv.errors || [];
    return errors.map((i)=>this.toResponseError(i));
  }
  toResponseError(ajvError) {
    const param = this.inferParam(ajvError);
    return InvalidRequestError({
      code:ajvError.keyword,
      message:ajvError.message,
      param:param
    });
  }
  inferParam(ajvError) {
    if(ajvError.dataPath) return ajvError.dataPath;
    if(ajvError.params.missingProperty) return ajvError.params.missingProperty;
    return "";
  }
}
module.exports.AjvSchemaValidator = AjvSchemaValidator;