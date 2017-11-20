var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, required: true},
  email: { type: String, unique: true, required: true},
  address: String,
  phone: String,
  city: String,
  country: {
    type: String, 
    default: "United States"
  },
  numberOfFundedAssets:{
    type: Number,
    default: 0
  },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  walletAddress: String,
  walletBalance: Number,
  gender: String,
  location: String,
  website: String,
  picture: String,
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  vk: String,

  hasBeenApproved: { type:Boolean, default:true, required:false },
  representing: { type:String, default:"", required:false },
  justification: { type:String, default:"", required:false },
  demo: { type:Boolean, default:false, required:false },
  hasBeenOnboarded: { type:Boolean, default:false, required:false },
  
}, schemaOptions);

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.virtual('gravatar').get(function() {
  if (!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
});

userSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
  }
};

var User = mongoose.model('User', userSchema);

module.exports = User;
