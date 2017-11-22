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
        "marketplace": {
          "kickbackAmount":1234
        },
        "asset": {
          "term": 317,
          "termType": "WEEKLY",
          "title": "Sed accumsan felis.",
          "mode":"Buy",
          "cargo":{},
          "costBreakdown":[{
            "id":"base",
            "amount":80000
          }],
          "isFractional": true
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
    describe('asset fields', () => {
      it('should have one error requiring `asset.costBreakdown` when undefined', () => {
        const data = validSample();
        delete data.asset.costBreakdown;
        const results = runValidationOn(data);
        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({
          code:"required",
          param:".asset",
          type:"invalid_request_error",
          message:"should have required property 'costBreakdown'"
        });
      });
      it('should have one error requiring `asset.costBreakdown` when empty', () => {
        const data = validSample();
        data.asset.costBreakdown = [];
        const results = runValidationOn(data);
        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({
          code:"minItems",
          param:".asset.costBreakdown",
          type:"invalid_request_error",
          message:"should NOT have less than 1 items"
        });
      });
      it('should have one error validating `asset.costBreakdown` when not an array', () => {
        const data = validSample();
        data.asset.costBreakdown = {};
        const results = runValidationOn(data);
        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({
          code:"type",
          param:".asset.costBreakdown",
          type:"invalid_request_error",
          message:"should be array"
        });
      });
      it('should have two errors validating `asset.costBreakdown` when item in array is not {id,amount}', () => {
        const data = validSample();
        data.asset.costBreakdown = [{x:"y",amount:"z"}]
        const results = runValidationOn(data);
        expect(results.length).toEqual(2);
        expect(results[0]).toEqual({
          code:"required",
          param:".asset.costBreakdown[0]",
          type:"invalid_request_error",
          message:"should have required property 'id'"
        });
        expect(results[1]).toEqual({
          code:"type",
          param:".asset.costBreakdown[0].amount",
          type:"invalid_request_error",
          message:"should be number"
        });
      });
      it('should have one error requiring `asset.mode` when undefined', () => {
        const data = validSample();
        delete data.asset.mode;
        const results = runValidationOn(data);
        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({
          code:"required",
          param:".asset",
          type:"invalid_request_error",
          message:"should have required property 'mode'"
        });
      });
      it('should have two errors validating `asset.mode` when not a valid string', () => {
        const data = validSample();
        data.asset.mode = 8888;
        const results = runValidationOn(data);
        expect(results.length).toEqual(2);
        expect(results[0]).toEqual({
          code:"type",
          param:".asset.mode",
          type:"invalid_request_error",
          message:"should be string"
        });
        expect(results[1]).toEqual({
          code:"enum",
          param:".asset.mode",
          type:"invalid_request_error",
          message:"should be equal to one of the allowed values"
        });
      });
      it('should have no errors validating `asset.mode` when mode is Buy', () => {
        const data = validSample();
        data.asset.mode = "Buy";
        const results = runValidationOn(data);
        expect(results.length).toEqual(0);
      });
      it('should have no errors validating `asset.mode` when mode is Sell', () => {
        const data = validSample();
        data.asset.mode = "Sell";
        const results = runValidationOn(data);
        expect(results.length).toEqual(0);
      });
      it('should have no errors requiring `asset.isFractional` when undefined', () => {
        const data = validSample();
        delete data.asset.isFractional;
        const results = runValidationOn(data);
        expect(results.length).toEqual(0);
      });
    });
  });
});