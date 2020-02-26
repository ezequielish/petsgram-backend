const API_PATH = "/api";

const { success } = require("../../../network/response");
const { add } = require("./controller");
const passport = require("passport");
require("../../../utils/strategies/auth/jwt");
module.exports = app => {
  app.post(
    `${API_PATH}/like/:idPhoto`,
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      try {
        await add(req.user, req.params.idPhoto, next);
        success(res, 201);
      } catch (error) {
        next(error);
      }
    }
  );
};
