var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var mongoose = require('mongoose');
var passport = require('passport');
var timeout = require('connect-timeout');
var helpers = require("./app/ResponseHelpers");
var util = require("util");

const AssetRepo = require("./models/Asset");
const ListingRepo = require("./models/Listing");
const multer = require('multer');
const multerS3 = require('multer-s3');

// Load environment variables from .env file
if(process.env.NODE_ENV !== 'production') {
  var dotenv = require('dotenv');
  dotenv.load();
}

var Jwt = require("./app/Jwt");

const postSocialUri = process.env.POST_SOCIAL_URI;
const postSocialLogin = (token)=>{
  // Should look something like this:
  //http://localhost:3000/postsocial/?token=${token}
  return util.format(postSocialUri, token);
}
const redirectPostSocial = (req, res)=>{
  const output = Jwt.makeAndSignUserToken(req.user);
  res.redirect(postSocialLogin(output.token));
};

var standardTimeout = function() { return timeout('10s'); }
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

// Controllers
var HomeCont = require('./controllers/home');
var userCont = require('./controllers/user');
var contactCont = require('./controllers/contact');

// Passport OAuth strategies
require('./config/passport');

var app = express();


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
if(process.env.DEBUG_MONGODB) mongoose.set('debug', true);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());

app.use(function(req, res, next) {
  // enables CORS for all endpoints
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(passport.initialize());
//app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

function requireJwtAuthentication() {
  return passport.authenticate("jwt", {session:false})
}

app.get('/', HomeCont.index);
//app.get('/contact', contactCont.contactGet);
//app.post('/contact', contactCont.contactPost);
app.get('/api/accounts', 
  standardTimeout(), haltOnTimedout,
  requireJwtAuthentication(), 
  userCont.accountGet);
//app.put('/api/accounts', requireJwtAuthentication(), userCont.accountPut);
//app.delete('/api/accounts', userCont.ensureAuthenticated, userCont.accountDelete);
//app.get('/signup', userCont.signupGet);
app.post('/api/accounts', 
  standardTimeout(), haltOnTimedout,
  userCont.signupPost);

//app.get('/api/login', userCont.loginGet);
app.post('/api/accounts/login', 
  standardTimeout(), haltOnTimedout,
  userCont.loginPost);
//app.get('/forgot', userCont.forgotGet);
//app.post('/forgot', userCont.forgotPost);
//app.get('/reset/:token', userCont.resetGet);
//app.post('/reset/:token', userCont.resetPost);
//app.get('/logout', userCont.logout);
//app.get('/unlink/:provider', userCont.ensureAuthenticated, userCont.unlink);
app.get('/api/accounts/auth/facebook', passport.authenticate('facebook', 
  { scope: ['email'] }));
app.get('/api/accounts/auth/facebook/callback', 
  passport.authenticate('facebook', {session:false}),
  redirectPostSocial
);
//app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
//app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/api/accounts/auth/twitter', passport.authenticate('twitter'));
app.get('/api/accounts/auth/twitter/callback', 
  passport.authenticate('twitter', { session:false }),
  redirectPostSocial);

//todo: improve this
var listings = require('./listings/listingController');
const Ownership = require('./listings/Ownership');
const listingsRepo = require("./listings/contextualListingRepoService").choose();
app.post('/api/listings/', 
  requireJwtAuthentication(),
  standardTimeout(), haltOnTimedout,
  listings.create);
app.get('/api/listings/mine',
  requireJwtAuthentication(),
  standardTimeout(), haltOnTimedout,
  listings.mine);
app.get('/api/listings/search', 
  standardTimeout(), haltOnTimedout, 
  listings.search);
app.post('/api/listings/search', 
  standardTimeout(), haltOnTimedout, 
  listings.search);
app.get('/api/listings/:id', 
  standardTimeout(), haltOnTimedout, 
  listings.getById);
app.delete('/api/listings/:id',
  requireJwtAuthentication(),
  standardTimeout(), haltOnTimedout, 
  listings.delete());

const ListingEditor = require("./listings/edit/ListingEditor");
const CreateListingSchema = require("./listings/create/CreateListingRequestJsonSchema").CreateListingRequestJsonSchema;
const AjvSchemaValidator = require("./app/AjvSchemaValidator").AjvSchemaValidator;
const AjvCreateListingSchemaValidator = require('./listings/create/AjvCreateListingSchemaValidator').AjvCreateListingSchemaValidator;
const ethereum = require(path.resolve("./controllers/ethereum"));
const ListingDeactivator = require("./listings/deactivate/ListingDeactivator");
const deactivator = ListingDeactivator.deactivateOnBlockchainAndStore(ethereum, ListingRepo);

app.get('/api/ownership',
  requireJwtAuthentication(),
  standardTimeout(), haltOnTimedout,
  Ownership.getOwnershipController(listingsRepo));
app.put('/api/ownership',
  requireJwtAuthentication(),
  standardTimeout(), haltOnTimedout,
  Ownership.putOwnershipController({listingsRepo, Asset:AssetRepo, deactivator}));

const editor = ListingEditor.makeEditor({
  repo: ListingEditor.makeRepo({
    AssetModel:AssetRepo,
    ListingModel:ListingRepo}),
  schemaValidator: new AjvCreateListingSchemaValidator(),
  stateValidator: ListingEditor.makeStateValidator(),
  blockchain: ListingEditor.makeBlockchain(ethereum)
});
app.put('/api/listings/:id', 
  requireJwtAuthentication(),
  standardTimeout(), haltOnTimedout, 
  listings.editListing(editor));

/*
app.get('/api/_temp/expirejob',
  standardTimeout(), haltOnTimedout, 
  listings.makeExpirerController(expirer)
);
*/

const Upload = require("./photos/Upload");
const AWS = require('aws-sdk');
const s3cfg = {
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: process.env.aws_region
};
const s3 = new AWS.S3(s3cfg);
const photoConfig = Upload.getPhotoConfig();
const uploadMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: photoConfig.bucketName,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: Upload.generateFileKey(Date.now)
  })
});
const associator = Upload.associateWithAsset(AssetRepo);
app.post('/api/assets/:id/photos',
  //standardTimeout(), haltOnTimedout,
  requireJwtAuthentication(),
  uploadMiddleware.array('photos', photoConfig.maxPhotos),
  Upload.controller(associator)
);

const Demo = require("./demo/DemoControllers");
const ViaSes = require("./demo/Notifier").ses;
const awsSes = new AWS.SES({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region:process.env.aws_region
});


app.post('/api/demo/accounts/notify', 
  Demo.notify([ViaSes(awsSes, process.env)])
);
app.post('/api/demo/accounts/', 
  Demo.create([ViaSes(awsSes, process.env)])
);
app.get('/api/demo/accounts/approvals',
  Demo.approve(process.env));
// temporary double route to handle a few messed up entries
// todo: remove it
app.get('/api/demo/accounts/approve',
  Demo.approve(process.env));
app.get('/api/accounts/demo/approve',
  Demo.approve(process.env));

// Production error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.sendStatus(err.status || 500);
});
const raygun = require("./app/logging/raygun");
const rollbar = require("./app/logging/rollbar");
raygun.register(app);
rollbar.register(app);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
});
module.exports = app;
