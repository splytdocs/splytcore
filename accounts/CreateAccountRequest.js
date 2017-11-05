const AjvSchemaValidator = require("./../app/AjvSchemaValidator").AjvSchemaValidator;
const schema = {
  "id": "CreateAccountRequest",
  "required": [
    "email", "username", "password",
    "name", "address", "phone"
  ],
  "properties": {
    "email": {
      "description": "The user's e-mail address.",
      "id": "/properties/email",
      "title": "Email",
      "type": "string",
      "format": "email"
    },
    "username": {
      "description": "The user's username.",
      "id": "/properties/username",
      "title": "Username",
      "type": "string"
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
    "address": {
      "description": "The user's address.",
      "id": "/properties/address",
      "title": "Address",
      "type": "string"
    },
    "phone": {
      "description": "The user's phone number.",
      "id": "/properties/phone",
      "title": "Phone",
      "type": "string"
    },
    "country": {
      "description": "The user's country.",
      "id": "/properties/country",
      "title": "Country",
      "type": "string"
    }
    
  },
  "type": "object"
};
module.exports.schema = schema;
module.exports.validator = new AjvSchemaValidator({schema});