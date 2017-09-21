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
        "expirationDate":"2017-09-21T04:08:11+00:00",
        "location": {
          "latitude": 40.6280245,
          "longitude": 117.2536039,
          "city":"Los Angeles",
          "state":"California",
          "zip":"90001"
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
    it('should return three errors requiring `asset`,`location`,`expirationDate` when missing `asset` and `location` and `expirationDate`', () => {
      const results = runValidationOn({x:"y"});
      
      expect(results[0]).toEqual({
        code:"required",
        param:"expirationDate",
        type:"invalid_request_error",
        message:"should have required property 'expirationDate'"
      });
      expect(results[1]).toEqual({
        code:"required",
        param:"asset",
        type:"invalid_request_error",
        message:"should have required property 'asset'"
      });
      expect(results[2]).toEqual({
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
    it('should have five errors requiring `.location.latitude`,`.location.longitude`,`.location.city`,`location.state`,`.location.zip` when those are undefined', () => {
      const data = validSample();
      data.location = {};
      const results = runValidationOn(data);
      expect(results.length).toEqual(5);
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
      expect(results[2]).toEqual({
        code:"required",
        param:".location",
        type:"invalid_request_error",
        message:"should have required property 'city'"
      });
      expect(results[3]).toEqual({
        code:"required",
        param:".location",
        type:"invalid_request_error",
        message:"should have required property 'state'"
      });
      expect(results[4]).toEqual({
        code:"required",
        param:".location",
        type:"invalid_request_error",
        message:"should have required property 'zip'"
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
    describe('expirationDate', () => {
      it('should return one error requiring `expirationDate` when undefined', () => {
        const data = validSample();
        delete data.expirationDate;
        const results = runValidationOn(data);
        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({
          code:"required",
          param:"expirationDate",
          type:"invalid_request_error",
          message:"should have required property 'expirationDate'"
        });
      });
      it('should return one error requiring `expirationDate` when not an RFC date-time', () => {
        const data = validSample();
        data.expirationDate = "2017-01-01";
        const results = runValidationOn(data);
        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({
          code:"format",
          param:".expirationDate",
          type:"invalid_request_error",
          message:'should match format "date-time"'
        });
      });
    });
  });
});