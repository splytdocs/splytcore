const AjvSchemaValidator = require("./../app/AjvSchemaValidator").AjvSchemaValidator;
const schema = {
  "id": "CreateDemoAccountRequest",
  "required": [
    "email", "password",
    "name", "representing", "justification"
  ],
  "properties": {
    "email": {
      "description": "The user's e-mail address.",
      "id": "/properties/email",
      "title": "Email",
      "type": "string",
      "format": "email"
    },
    "password": {
      "description": "The user's password.",
      "id": "/properties/password",
      "title": "Password",
      "type": "string"
    },
    "name": {
      "description": "The user's full name.",
      "id": "/properties/name",
      "title": "Name",
      "type": "string"
    },
    "representing":{
      "description": "The company this user represents.",
      "id": "/properties/representing",
      "title": "Who You Represent",
      "type": "string"
    },
    "justification":{
      "description": "Why this user desires demo access.",
      "id": "/properties/justification",
      "title": "Why do you want access?",
      "type": "string"
    },
    "country": {
      "description": "The user's country.",
      "id": "/properties/location/country",
      "title": "Country",
      "type": "string"
    }
  },
  "type": "object"
};
module.exports.schema = schema;
module.exports.validator = new AjvSchemaValidator({schema});