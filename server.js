var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var passport = require('passport');
var timeout = require('connect-timeout');

// Load environment variables from .env file
dotenv.load();

// Controllers
var HomeCont = require('./controllers/home');
var userCont = require('./controllers/user');
var contactCont = require('./controllers/contact');

// Passport OAuth strategies
require('./config/passport');

var app = express();


mongoose.Promise = global.Promise;
mongoose.set('debug', true)
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
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
app.get('/api/accounts', requireJwtAuthentication(), userCont.accountGet);
//app.put('/api/accounts', requireJwtAuthentication(), userCont.accountPut);
//app.delete('/api/accounts', userCont.ensureAuthenticated, userCont.accountDelete);
//app.get('/signup', userCont.signupGet);
app.post('/api/accounts', userCont.signupPost);

//app.get('/api/login', userCont.loginGet);
app.post('/api/accounts/login', userCont.loginPost);
//app.get('/forgot', userCont.forgotGet);
//app.post('/forgot', userCont.forgotPost);
//app.get('/reset/:token', userCont.resetGet);
//app.post('/reset/:token', userCont.resetPost);
//app.get('/logout', userCont.logout);
//app.get('/unlink/:provider', userCont.ensureAuthenticated, userCont.unlink);
//app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
//app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
//app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
//app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
//app.get('/auth/twitter', passport.authenticate('twitter'));
//app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

//todo: improve this
var listings = require('./listings/listingController');
var standardTimeout = function() { return timeout('10s'); }
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}
app.post('/api/listings/', 
  requireJwtAuthentication(),
  standardTimeout(), haltOnTimedout,
  listings.create);
app.get('/api/listings/search', 
  standardTimeout(), haltOnTimedout, 
  listings.search);
app.get('/api/listings/:id', 
  standardTimeout(), haltOnTimedout, 
  listings.getById);
app.delete('/api/listings/:id',
  userCont.ensureAuthenticated, 
  standardTimeout(), haltOnTimedout, 
  listings.delete);

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
