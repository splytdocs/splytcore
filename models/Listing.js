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

var listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  listedByUserId: {type: ObjectId, required: true },
  dateListed: { type: Date, default: Date.now, required: true },
  isActive: { type: Boolean, default: true, required: true },
  contributionTotal: { type: Number, min: 0, required: true, default:0 },
  /* "Foreign key" to Asset */
  assetId: {type:ObjectId, required: true },
  location: {
    type: [Number],
    index: '2d',
    required: true
  },
}, schemaOptions);

var Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
