const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const JwtStrategy = require("passport-jwt").Strategy;

// const error = require("../../error");


const {
    authJwtSecret
} = require("../../../config");

passport.use(
  new JwtStrategy(
    {
      secretOrKey: authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() 
    },
    async function(tokenPayload, cb) {
      try {
        cb(null, { ...tokenPayload });
      } catch (error) {
         
        return cb(error, null);
      }
    }
  )
);
