var LocalStrategy = require('passport-local').Strategy;
const Scrub = require("./../app/Scrub");
const standardMongoScrub = Scrub.standardMongoScrub;
const deleteSensitiveFields = Scrub.deleteSensitiveFields;

module.exports.use = (passport, User) => {
  // Sign in with Email and Password
  passport.use(new LocalStrategy({
    usernameField: 'username'
  }, function (username, password, done) {
    const criteria = {
      username
    };
    User.findOne(criteria, (err, user) => {
      if (!user) {
        return done(null, false, {message: `The username ${username} is not associated with any account. Double-check your username and try again.`});
      }
      if(process.env.require_approval && !user.hasBeenApproved) {
        return done(null, false, {
          code:"pending_approval",
          message:`Your account is still pending approval.`
        });
      }
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          return done(null, false, {message: 'Invalid username or password'});
        }
        return done(null, user);
      });
    });
  }));

};