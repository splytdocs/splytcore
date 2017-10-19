const schema = {
  "id": "CreateListingRequest", 
  "required":["asset", "location","expirationDate"],
  "properties": {
    "expirationDate": {
      "description": "The date on which this listing should end if not funded.", 
      "id": "/properties/listing/properties/expirationDate", 
      "title": "Expiration Date", 
      "type": "string",
      "format":"date-time"
    }, 
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
        "cargo": {
          "description": "Specific information about this individual asset not able to be generalized. For instance, a vehicle would have a `cargo` object describing its Year, Make, Model, Trim, etc. Season Tickets may have something like Team, Box, etc.", 
          "id": "/properties/asset/properties/cargo", 
          "title": "Specific information about this individual asset not able to be generalized.", 
          "type": "object"
        },
        "costBreakdown": {
          "description": "A list of all the various costs associated with owning this asset.",
          "id": "/properties/asset/properties/costBreakdown",
          "title":"Cost Breakdown",
          "type":"array",
          "minItems":1,
          "items":{
            "type":"object",
            "required":["id","amount"],
            "properties":{
              "id": {
                "description": "The identifier of this type of cost.", 
                "id": "/properties/asset/properties/costBreakdown/item/id", 
                "title": "Cost ID", 
                "type": "string"
                // base, insurance, taxes, registration, fees, maintenance, cleaning, service, delivery
              },
              "amount":{
                "description": "The currency value for this cost.", 
                "id": "/properties/asset/properties/costBreakdown/item/amount", 
                "title": "Amount", 
                "type": "number",
                "minimum": 0
              }
            }
          }
        },
        "mode":{
          "description": "Whether this asset is being bought or sold.", 
          "id": "/properties/asset/properties/mode", 
          "title": "Mode", 
          "type": "string",
          "enum": ["Buy", "Sell"]
        },
        "description": {
          "description": "The text description of this asset.", 
          "id": "/properties/properties/asset/description", 
          "title": "Description", 
          "type": "string"
        }
      }, 
      "type": "object",
      "required":["term", "termType", "title","cargo", "costBreakdown", "mode"]
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
    },
    "description": {
      "description": "The text description of this listing.", 
      "id": "/properties/properties/description", 
      "title": "Description", 
      "type": "string"
    }
  }, 
  "type": "object"
};
class CreateListingRequestJsonSchema {
  constructor() {
    this.schema = schema;
  }
};
module.exports.CreateListingRequestJsonSchema = CreateListingRequestJsonSchema;
module.exports.schema = schema;