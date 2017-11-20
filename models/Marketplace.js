var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var marketplaceSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true},
  walletAddress: { type: String, unique: false, required: true}
}, schemaOptions);

var Marketplace = mongoose.model('Marketplace', marketplaceSchema);

module.exports = Marketplace;
