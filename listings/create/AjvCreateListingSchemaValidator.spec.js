const AjvCreateListingSchemaValidator = require('./AjvCreateListingSchemaValidator').AjvCreateListingSchemaValidator;
const Ajv = require("ajv");
const CreateListingRequestJsonSchema = require("./CreateListingRequestJsonSchema").CreateListingRequestJsonSchema;

describe('AjvCreateListingSchemaValidator', () => {
  describe('constructor', () => {
    it('should default schema to equal CreateListingRequestJsonSchema.schema', () => {
      const underTest = new AjvCreateListingSchemaValidator();
      expect(underTest.schema).toEqual(new CreateListingRequestJsonSchema().schema);
    });
    it('should default ajv to instance of Ajv', () => {
      const underTest = new AjvCreateListingSchemaValidator();
      expect(underTest.ajv).toBeInstanceOf(Ajv);
    });
  });
  describe('realistic', () => {
    function validSample() {
      return {
        "location": {
          "latitude": 40.6280245,
          "longitude": 117.2536039
        },
        "asset": {
          "term": 317,
          "termType": "WEEKLY",
          "totalPrice": 97706,
          "title": "Sed accumsan felis.",
          "cargo":{}
        }
      }
    };
    function runValidationOn(data) {
      return new AjvCreateListingSchemaValidator().validate(data);
    }
    it('should have a two of errors requiring `asset` and `location` when missing `asset` and `location`', () => {
      const results = runValidationOn({x:"y"});
      //expect(results.length).toEqual(2);
      expect(results[0]).toEqual({
        code:"required",
        param:"asset",
        type:"invalid_request_error",
        message:"should have required property 'asset'"
      });
      expect(results[1]).toEqual({
        code:"required",
        param:"location",
        type:"invalid_request_error",
        message:"should have required property 'location'"
      });
    });
    it('should have one error for minimum on `term` when -1', () => {
      const data = validSample();
      data.asset.term = -1;
      const results = runValidationOn(data);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"minimum",
        param:".asset.term",
        type:"invalid_request_error",
        message:"should be >= 0"
      });
    });
    it('should have one error for minimum on `totalPrice` when -1', () => {
      const data = validSample();
      data.asset.totalPrice = -1;
      const results = runValidationOn(data);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"minimum",
        param:".asset.totalPrice",
        type:"invalid_request_error",
        message:"should be >= 0"
      });
    });
    it('should have a two of errors requiring `.location.latitude` and `.location.longitude` when those are undefined', () => {
      const data = validSample();
      data.location = {};
      const results = runValidationOn(data);
      expect(results.length).toEqual(2);
      expect(results[0]).toEqual({
        code:"required",
        param:".location",
        type:"invalid_request_error",
        message:"should have required property 'latitude'"
      });
      expect(results[1]).toEqual({
        code:"required",
        param:".location",
        type:"invalid_request_error",
        message:"should have required property 'longitude'"
      });
    });
    it('should have one error requiring `asset.cargo` when undefined', () => {
      const data = validSample();
      delete data.asset.cargo;
      const results = runValidationOn(data);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual({
        code:"required",
        param:".asset",
        type:"invalid_request_error",
        message:"should have required property 'cargo'"
      });
    });
  });
});