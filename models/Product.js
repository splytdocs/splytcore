var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var Product = new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  term: {
    type: Number,
    min: 0,
    max: 365,
    required: true,
  },
  termType: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  location: {
    type: [Number],
    index: '2d',
    required: true
  },
}, schemaOptions);

var Product = mongoose.model('Product', productSchema);

module.exports = Product;