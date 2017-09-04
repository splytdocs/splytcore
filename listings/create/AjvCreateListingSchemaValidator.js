const CreateListingRequestJsonSchema = require("./CreateListingRequestJsonSchema").CreateListingRequestJsonSchema;
const AjvSchemaValidator = require("./../../app/AjvSchemaValidator").AjvSchemaValidator;

class AjvCreateListingSchemaValidator extends AjvSchemaValidator {
  constructor() {
    super({
      schema: new CreateListingRequestJsonSchema().schema
    });
  }
}
module.exports.AjvCreateListingSchemaValidator = AjvCreateListingSchemaValidator;