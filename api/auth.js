const passport = require("passport")
const passportJWT = require("passport-jwt")
const { user, domain } = require("./models")
const config = require("../config")
const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy

module.exports = {
  initialize: () => {
    passport.use(
      new Strategy({
        secretOrKey: config.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
      }, (jwtPayload, done) => {
        user.findById(jwtPayload.id, {
          attributes: ['id'],
          include: [{ model: domain }]
        })
        .then(user => {
          if(!user) {
            return done(new Error('User not found'), null)
          }
          return done(null, {
            id: user.id + user.token_expire,
            domain: user.domain.name
          })
        })
        .catch(err => done(new Error('Something went wrong'), null))
      })
    )
    return passport.initialize()
  },
  authenticate: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if(err) {
        return res.sendStatus(401)
      }
      req.user = user
      next()
    })(req, res, next)
  },
  checkDomainRestriction: domain => (req, res, next) => {
    if(req.user.domain !== domain) {
      return res.sendStatus(403)
    }
    next()
  }
}
