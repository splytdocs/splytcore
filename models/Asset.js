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
var stakeSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})

var ownershipSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    default: "OPEN"
  },
  stakes: [stakeSchema]
});

var photosSchema = new mongoose.Schema({
  uri: {
    type: String,
    required: true
  },
  userId: {
    type: ObjectId,
  },
  tags:{
    type: [String],
    default:[]
  }
});

var assetSchema = new mongoose.Schema({
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
  photos: [photosSchema],
  mode: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  amountFunded: {
    type: Number,
    default: 0,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  cargo: {
    type: Object,
  },
  description:{
    type: String,
    default: "",
    required: false
  },
  ownership: ownershipSchema
}, schemaOptions);

assetSchema.pre('save', function (next) {
  recalculateAmountFunded.call(this);
  next();
});

function recalculateStakes(on) {
  let result = 0;
  // todo: This doesn't seem like the right way iterate these inner properties
  var stakes = on._doc.ownership._doc.stakes;
  for (var index = 0; index < stakes.length; index++) {
    var element = stakes[index];
    result += element._doc.amount;
  }
  return result;
}
function recalculateAmountFunded() {
  const record = this;
  const amountFunded = recalculateStakes(record);
  record.amountFunded = amountFunded;
}
assetSchema.recalculateAmountFunded = recalculateAmountFunded;

var Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
