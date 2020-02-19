const jwt = require("jsonwebtoken");
const error = require("../../../utils/error");
const { getApiToken } = require("../apiKeyToken/model");
const { authJwtSecret } = require("../../../config");

async function sigin(user, req, next) {
  try {
    const token = req.body.apiKeyToken;
    const apiKeyToken = await getApiToken(token); //validamos el api-key token

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
      expiresIn: "15m"
    });

    const data = {
        token: newToken,
        ...user
    }
 
    return data;
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sigin
};
