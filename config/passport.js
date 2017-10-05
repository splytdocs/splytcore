var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
var Jwt = require("./../app/Jwt");
var User = require('../models/User');
var Twitter = require("./passport.Twitter");
var Facebook = require("./passport.Facebook");
var Local = require("./passport.Local");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

Local.use(passport, User);
Facebook.use(passport, User);
Twitter.use(passport, User);

const jwtOptions = Object.assign({}, Jwt.options, {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
});
passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
  if (process.env.SPOOF_AUTH_AS) {
    console.log(`spoofing auth as ${process.env.SPOOF_AUTH_AS}`);
    jwt_payload.id = process.env.SPOOF_AUTH_AS;
  }
  User.findById(jwt_payload.id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    function sendNotFound() {
      return done(null, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return sendNotFound();
      // or you could create a new account
    }
  });
}));