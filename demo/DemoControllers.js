const AccountCreation = require("./../accounts/AccountCreation");
const canUserBeCreated = AccountCreation.canUserBeCreated;
const User = require("./../models/User");

const CreateAccountRequest = require("./CreateDemoAccountRequest");
const SingleErrorResponse = require("./../app/SingleErrorResponse");
const makeError = SingleErrorResponse.InvalidRequestError;
const validator = CreateAccountRequest.validator;
const notify = require("./Notifier").notify
const helpers = require("./../app/ResponseHelpers");
const send500 = helpers.send500,
  send200 = helpers.send200
  send404Message = helpers.send404Message,
  sendValidationError = helpers.sendValidationError,
  sendNotAuthenticated = helpers.sendNotAuthenticated;

const Scrub = require("./../app/Scrub");
const standardMongoScrub = Scrub.standardMongoScrub;
const deleteSensitiveFields = Scrub.deleteSensitiveFields;
const Ethereum = require("./../controllers/ethereum.js");

function log() {
  console.log("Demo Accounts:", ...arguments);
}

function scrubUser(user) {
  const copy = Object.assign({}, user);
  return deleteSensitiveFields(
    standardMongoScrub(copy)
  );
}
function createDemoAccount(doc, callback) {
  function write(walletAddress) {
    const making = {
      username:doc.email,
      email:doc.email,
      password:doc.password,
      hasBeenApproved:false,
      justification:doc.justification,
      representing:doc.representing,
      demo:true,
      address:doc.address||"2800 E Observatory Rd, Los Angeles, CA 90027",
      phone:doc.phone||"(999) 555-5555",
      name:doc.name,
      country:doc.country,
      walletAddress:walletAddress
    };
    const logging = Object.assign({}, making);
    delete logging.password;
    log("Attempting to write", logging);
    AccountCreation.sanitizeAndCreate(User)(making, (err, data)=>{
      if(err) log("Write failed in sanitizeAndCreate", err);
      callback(err, data);
    });
  }
  log("Attempting to create wallet");
  
  Ethereum.createWallet().then(address => {
    write(address);
    Ethereum.giveOutTokens(address, (err, txHash) => {
      log('sendEther', err, txHash);
    })
    return address
  }, (err)=> {
    const logging = Object.assign({}, doc);
    delete logging.password;
    log(`Failed to create wallet: `, err, logging);
    callback(new Error("Failed to create wallet, try again. Sorry!"), null);
  })
}
module.exports.notify = (methods=null)=> function(req, res) {
  const input = req.body;
  setTimeout(()=>notify(methods)(input),0);
  send200(res, "Sent");
}
module.exports.create = (notificationMethods=null) => function(req, res) {
  const input = req.body;
  const errors = validator.validate(input);
  if (errors.length > 0) {
    log("400:", errors);
    return sendValidationError(res, errors);
  }
  function createUser() {
    const toLog = Object.assign({}, input);
    delete toLog.password;
    log("createUser", toLog);
    createDemoAccount(input, (err, made)=>{
      if(err) {
        log(`create failed, ${input.email}`, err);
        send500(res, err);
      } else {
        log(`created successfully ${input.email}`);
        send200(res, scrubUser(made));
        notify(notificationMethods)(made._doc);
      }
    });
  };
  /* Check if username or e-mail is in use already */
  const username = input.username, email = input.email;
  const handle = (err, data)=>{
    if(err) {
      log("cannot be created", err, data);
      return sendValidationError(res, err);
    } else {
      return createUser();
    }
    send500(res, err);
  };
  AccountCreation.canUserBeCreated()({username, email}, handle);
};
module.exports.approve = (config, userApprovedNotifier)=> function(req, res) {
  const secret = req.query.secret;
  if(secret!=config.demo_approval_secret_key) {
    return sendNotAuthenticated(res);
  }
  const userId = req.query.userId;
  let approve = true;
  if(req.query.approve) {
    approve = req.query.approve == 'true';
  }
  function save(u) {
    u.save((err, data)=>{
      if(err) return send500(res, err);
      if(u.hasBeenApproved) {
        userApprovedNotifier.send(u);
      }
      send200(res, "User has been approved.");
    });
  }
  User.findById(userId, (err, user)=>{
    if(err) return send500(res, err);
    if(!user) return send500(res, {
      message:"User not found, or something bad happened."
    });
    user.hasBeenApproved = approve;
    save(user);
  });
};