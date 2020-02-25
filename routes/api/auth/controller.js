const jwt = require("jsonwebtoken");
const error = require("../../../utils/error");
const { getApiToken } = require("../apiKeyToken/model");
const { authJwtSecret } = require("../../../config");

async function sigin(user, next) {

  
  if (!user.scope) {
    throw error("No autorizado", 401);
  }

  try {
    const apiKeyToken = await getApiToken(user.scope); //validamos el api-key token

    if (!apiKeyToken.length) {
      throw error("No autorizado", 401);
    }

    const { _id: id, email, name } = user;
    const payload = {
      sub: id,
      name,
      email,
      scopes: apiKeyToken[0].scopes
    };

    const newToken = jwt.sign(payload, authJwtSecret, {
      expiresIn: "59m"
    });

    const data = {
        token: newToken,
        file: user.file,
        name: user.name,
        email: user.email
    }
 
    return data;
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sigin
};
