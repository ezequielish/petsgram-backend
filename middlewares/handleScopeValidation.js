const error = require("./errors");

function scopesValidationHandler(allowedScopes) {
  return function(req, res, next) {
    if (!req.user || (req.user && !req.user.scopes)) {
      const err = {
        message: "Missing scopes"
      };
      throw error(err);
    }
    const hasAccess = allowedScopes
      .map(allowedScope => req.user.scopes.includes(allowedScope))
      .find(allowed => Boolean(allowed)); //return true || false

    if (hasAccess) {
      return next();
    } else {
      const errNoAuth = {
        message: "No autorizado"
      };
      next(errNoAuth);
    }
  };
}

module.exports = scopesValidationHandler;
