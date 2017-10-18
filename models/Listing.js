var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');


var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};
var locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: false,
    default: ""
  },
  state: {
    type: String,
    required: false,
    default: ""
  },
  zip: {
    type: String,
    required: false,
    default: ""
  },
  // For index & distance calculation in Mongo
  coordinates:{
    type: [Number],  // [<longitude>, <latitude>]
    index: '2dsphere',
    required:false
  }
});
var listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  listedByUserId: {
    type: ObjectId,
    required: true
  },
  dateListed: {
    type: Date,
    default: Date.now,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  /* "Foreign key" to Asset */
  assetId: {
    type: ObjectId,
    required: true
  },
  location: locationSchema,
  expirationDate: {
    type: Date,
    required: true
  },
  isFeatured:{
    type: Boolean,
    default: false,
    required: false
  },
  description:{
    type: String,
    default: "",
    required: false
  }
}, schemaOptions);

function setComputedCoordinates() {
  //this.location.coordinates = [this.location.longitude, this.location.latitude]
}
listingSchema.pre('validate', function (next) {
  setComputedCoordinates.call(this);
  next();
});
listingSchema.plugin(mongooseAggregatePaginate);
var Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
