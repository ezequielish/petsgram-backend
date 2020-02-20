const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const bcrypt = require("bcrypt");
const error = require("../../error");
const { getUserEmail } = require("../../../routes/api/users/model");

passport.use(
  new BasicStrategy(async function(email, password, cb) {
    try {
      
      const user = await getUserEmail(email);
      
      if (!user.length) {
        throw error("No autorizado", 401);
        // return cb("No autorizado", false);
      }

      if (!(await bcrypt.compare(password, user[0].password))) {
        throw error("No autorizado", 401);
      }
      
      delete user[0].password;
     
      return cb(null, user[0]);
    } catch (error) {
      return cb(error, null);
    }
  })
);
