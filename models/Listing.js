var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var listingSchema = new mongoose.Schema({
  id: { type: Schema.Types.ObjectId, default: new ObjectId(), required: true },
  title: { type: String, required: true },
  listedByUserId: {type: Schema.Types.ObjectId, required: true },
  dateListed: { type: Date, default: Date.now, required: true },
  isActive: { type: Boolean, default: true, required: true },
  contributionTotal: { type: Number, min: 0, required: true },
  /* "Foreign key" to Asset */
  assetId: {type: Schema.Types.ObjectId, required: true },
  location: {
    type: [Number],
    index: '2d',
    required: true
  },
}, schemaOptions);

var Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
