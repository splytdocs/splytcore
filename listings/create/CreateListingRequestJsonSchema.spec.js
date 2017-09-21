

const CreateListingRequestJsonSchema = require("./CreateListingRequestJsonSchema").CreateListingRequestJsonSchema;
describe('CreateListingRequestJsonSchema', () => {
  it('`schema` defaults to expected value', () => {
    return
    const underTest = new CreateListingRequestJsonSchema();
    expect(underTest.schema).toEqual({
      "id": "CreateListingRequest", 
      "required":["asset", "location"],
      "properties": {
        "asset": {
          "id": "/properties/asset", 
          "properties": {
            "term": {
              "description": "The term value.", 
              "id": "/properties/asset/properties/term", 
              "title": "The term value.", 
              "type": "integer",
              "minimum":0
            }, 
            "termType": {
              "description": "The term type.", 
              "id": "/properties/asset/properties/termType", 
              "title": "The term type.", 
              "type": "string"
            }, 
            "title": { 
              "description": "A title describing this asset.", 
              "id": "/properties/asset/properties/title", 
              "title": "A title describing this asset.", 
              "type": "string"
            }, 
            "totalPrice": {
              "description": "The desired price of this asset.", 
              "id": "/properties/asset/properties/totalPrice", 
              "title": "The desired price of this asset", 
              "type": "number",
              "minimum":0
            },
            "cargo": {
              "description": "Specific information about this individual asset not able to be generalized. For instance, a vehicle would have a `cargo` object describing its Year, Make, Model, Trim, etc. Season Tickets may have something like Team, Box, etc.", 
              "id": "/properties/asset/properties/cargo", 
              "title": "Specific information about this individual asset not able to be generalized.", 
              "type": "object"
            }
          }, 
          "type": "object",
          "required":["term", "termType", "title","totalPrice","cargo"]
        }, 
        "location": {
          "id": "/properties/location", 
          "required":["latitude","longitude","city","state","zip"],
          "properties": {
            "latitude": {
              "description": "The latitude of the listing's target location.", 
              "id": "/properties/location/properties/latitude", 
              "title": "Latitude", 
              "type": "number"
            }, 
            "longitude": {
              "description": "The longitude of the listing's target location.", 
              "id": "/properties/location/properties/longitude", 
              "title": "Longitude", 
              "type": "number"
            }, 
            "city": {
              "description": "The name of the city which this listing is targeting.", 
              "id": "/properties/location/properties/city", 
              "title": "City", 
              "type": "string"
            }, 
            "state": {
              "description": "The name of the state which this listing is targeting.", 
              "id": "/properties/location/properties/state", 
              "title": "State", 
              "type": "string"
            }, 
            "zip": {
              "description": "The name of the zip which this listing is targeting.", 
              "id": "/properties/location/properties/zip", 
              "title": "Zip", 
              "type": "string"
            }
          }, 
          "type": "object"
        }
      }, 
      "type": "object"
    });
  });
});