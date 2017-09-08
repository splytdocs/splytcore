class CreateListingRequestJsonSchema {
  constructor() {
    this.schema = {
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
            },
          }, 
          "type": "object",
          "required":["term", "termType", "title","totalPrice","cargo"]
        }, 
        "location": {
          "id": "/properties/location", 
          "required":["latitude","longitude"],
          "properties": {
            "latitude": {
              "description": "The latitude of the listing's location.", 
              "id": "/properties/location/properties/latitude", 
              "title": "The latitude schema", 
              "type": "number"
            }, 
            "longitude": {
              "description": "The longitude of the listing's location.", 
              "id": "/properties/location/properties/longitude", 
              "title": "The longitude schema", 
              "type": "number"
            }
          }, 
          "type": "object"
        }
      }, 
      "type": "object"
    };
  }
};
module.exports.CreateListingRequestJsonSchema = CreateListingRequestJsonSchema;