var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var output = new mongoose.Schema({
  id: { type: ObjectId, default: new ObjectId(), required: true },
  assetId: { type:Number, required: true},
  // todo: how do we link this to a user/wallet? userId
  // Just by userID or is that not anonymous enough?
  amount: { type:Number, required: true }
}, schemaOptions);

var Contribution = mongoose.model('Contribution', output);

module.exports = Contribution;
