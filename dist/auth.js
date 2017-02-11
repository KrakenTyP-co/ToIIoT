"use strict";

var passport = require("passport");
var passportJWT = require("passport-jwt");

var _require = require("./models"),
    user = _require.user,
    domain = _require.domain;

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

module.exports = {
  initialize: function initialize() {
    passport.use(new Strategy({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeader()
    }, function (jwtPayload, done) {
      user.findById(jwtPayload.id, {
        attributes: ['id'],
        include: [{ model: domain }]
      }).then(function (user) {
        if (!user) {
          return done(new Error('User not found'), null);
        }
        return done(null, {
          id: user.id + user.token_expire,
          domain: user.domain.name
        });
      }).catch(function (err) {
        return done(new Error('Something went wrong'), null);
      });
    }));
    return passport.initialize();
  },
  authenticate: function authenticate(req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user) {
      if (err) {
        return res.sendStatus(401);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  checkDomainRestriction: function checkDomainRestriction(domain) {
    return function (req, res, next) {
      if (req.user.domain !== domain) {
        return res.sendStatus(403);
      }
      next();
    };
  }
};