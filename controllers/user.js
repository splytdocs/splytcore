var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
const helpers = require("./../app/ResponseHelpers");
const send500 = helpers.send500,
      send200 = helpers.send200
      send404Message = helpers.send404Message,
      sendValidationError = helpers.sendValidationError,
      sendNotAuthenticated = helpers.sendNotAuthenticated;
const Scrub = require("./../app/Scrub");
const standardMongoScrub = Scrub.standardMongoScrub;
const deleteSensitiveFields = Scrub.deleteSensitiveFields;
const _ = require("lodash");
var Jwt = require("./../app/Jwt");
const Ethereum = require("./ethereum.js");

const AccountCreation = require("./../accounts/AccountCreation");
const CreateAccountRequest = require("./../accounts/CreateAccountRequest");
const SingleErrorResponse = require("./../app/SingleErrorResponse");
const makeError = SingleErrorResponse.InvalidRequestError;
const validator = CreateAccountRequest.validator;
const uniqueCode = SingleErrorResponse.codes.unique;
const canUserBeCreated = AccountCreation.canUserBeCreated;
const listingsRepo = require("./../listings/contextualListingRepoService").choose();

function scrubUser(user) {
  const copy = Object.assign({}, user);
  return deleteSensitiveFields(
    standardMongoScrub(copy)
  );
}
/**
 * Login required middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    return sendNotAuthenticated(res);
  }
};

/**
 * GET /login
 */
exports.loginGet = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Log in'
  });
};

/**
 * POST /login
 */
exports.loginPost = function(req, res, next) {
  req.assert('username', 'Username cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return sendValidationError(res, errors);
  }

  passport.authenticate('local', (err, user, info)=>{
    if (!user) {
      return sendValidationError(res, [info]);
    }
    req.logIn(user, function(err) {
      if(err) {
        return sendValidationError(res, [err]);
      }
      const output = Jwt.makeAndSignUserToken(user);
      return send200(res, output);
    });
  })(req, res, next);
};

/**
 * GET /logout
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.signupPost = function(req, res, next) {

  const input = req.body;
  const errors = validator.validate(input);
  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }
  function createUser() {
    const doc = Object.assign({}, input);
    Ethereum.createWallet()
    .then(address => {
      Ethereum.giveOutTokens(address, (err, txHash) => {
        console.log('maybe save this in db for future')
      })
      return address
    })
    .then( (address) => {
      doc.walletAddress = address;
      AccountCreation.sanitizeAndCreate(User)(doc, (err, made)=>{
        if(err) {
          send500(res, err);
        } else {
          send200(res, scrubUser(made));
        }
      });
    })
  };
  /* Check if username or e-mail is in use already */
  const username = input.username, email = input.email;
  const handle = (err, data)=>{
    if(err) {
      return sendValidationError(res, err);
    } else {
      return createUser();
    }
    send500(res, null);
  };
  canUserBeCreated()({username, email}, handle);
};

function amendReputationScore(user) {
  return new Promise((resolve, reject)=>{
    listingsRepo.calculateReputationScore(user.id)
    .then((score)=>{
      user._doc.reputationScore = score;
      resolve(score);
    }, reject);
  });
}

exports.accountGet = function(req, res, next) {
  User.findById(req.user.id, (err, user)=>{
    if(err) {
      return sendValidationError(res, [{message:"Something bad happened"}]);
    }
    amendReputationScore(user)
      .then(()=> {
      if(!user.walletAddress) {
        Ethereum.createWallet()
        .then(function(address) {
          user.walletAddress = address;
          user.save();
          return send200(res, scrubUser(user));
        }, (err)=> { send500(res, err); });
      } else {
        let ethReturned = false;
        Ethereum.getWalletBalance(user.walletAddress, (err2, balance) => {
          ethReturned = true;
          if(err2) {
            console.error(`WalletError: getting wallet balance for '${user.username}'`, err2);
            balance = 0;
          }
          user.walletBalance = balance;
          return send200(res, scrubUser(user));
        });
        setTimeout(()=> {
          if(!ethReturned) {
            console.warn(`WalletError: gave up waiting for blockchain for '${user.username}'`)
            user.walletBalance = 0;
            return send200(res, scrubUser(user));
          }
        }, 500);
        
      }
    });
  });
}
const jsonpatch = require("json-patch-mongoose");
exports.accountPatch = (req, res, next)=> {
  function handleSave(err, user) {
    if(err) return sendValidationError(res, [err]);
    return send200(res, scrubUser(user));
  }
  function withoutUnpatchablePaths(source) {
    const unpatchables = ["/walletBalance", "/walletAddress","username", "id", "numberOfFundedAssets"]
    return _.filter(source, i=>unpatchables.indexOf(i.path) == -1);
  }
  User.findById(req.user.id, (err, user)=> {
    if(err) {
      return sendValidationError(res, [{message:"Something bad happened"}]);
    }
    let patchBody = Object.assign({}, req.body);
    patchBody = withoutUnpatchablePaths(patchBody);
    jsonpatch.apply(user, patchBody);
    user.save(handleSave);
  });
}

/**
 * GET /unlink/:provider
 */
exports.unlink = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    switch (req.params.provider) {
      case 'facebook':
        user.facebook = undefined;
        break;
      case 'google':
        user.google = undefined;
        break;
      case 'twitter':
        user.twitter = undefined;
        break;
      case 'vk':
        user.vk = undefined;
        break;
      case 'github':
          user.github = undefined;
        break;
      default:
        req.flash('error', { msg: 'Invalid OAuth Provider' });
        return res.redirect('/account');
    }
    user.save(function(err) {
      req.flash('success', { msg: 'Your account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /forgot
 */
exports.forgotGet = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 */
exports.forgotPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', { msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
          return res.redirect('/forgot');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'support@yourdomain.com',
        subject: '✔ Reset your password on Mega Boilerplate',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
        res.redirect('/forgot');
      });
    }
  ]);
};

/**
 * GET /reset
 */
exports.resetGet = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User.findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset
 */
exports.resetPost = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        from: 'support@yourdomain.com',
        to: user.email,
        subject: 'Your Mega Boilerplate password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Your password has been changed successfully.' });
        res.redirect('/account');
      });
    }
  ]);
};
