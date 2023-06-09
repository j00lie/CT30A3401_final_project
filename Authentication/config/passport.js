//Passport strategy for user authentication.

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const mongoose = require("mongoose");
const User = mongoose.model("User");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
  User.findOne({ username: jwt_payload.username })
    .then((user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch((err) => console.error(err));
});
