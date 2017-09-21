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
var costBreakdownSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
});

var assetSchema = new mongoose.Schema({
  // todo: revisit this, how should we store photos and their data? Probably just
  // store a relative uri here
  photoUri: {
    type: String,
    required: false
  },
  // todo: What about physical assets like season tickets? Do those fall into this
  // model, or does it at least allow us to expand to that without painting
  // ourselves into a corner? re:terms/termType Might be thinking about this too
  // relationally
  term: {
    type: Number,
    min: 0,
    max: 365,
    required: true
  },
  termType: {
    type: String,
    enum: [
      'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
    ],
    required: true
  },
  costBreakdown: [costBreakdownSchema],
  photos: {
    type: Array,
    required: false
  },
  mode: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    required: false
  },
  amountFunded: 0,
  title: {
    type: String,
    required: true
  },
  cargo: {
    type: Object,
    required: false
  }
}, schemaOptions);

var Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
