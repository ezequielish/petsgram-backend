const API_PATH = "/api";

const { success } = require("../../../network/response");
const { add, getCategorieOrUser, deletePhoto } = require("./controller");
const {
    configFilePhoto
} = require("../../../middlewares/multerFileName");
const upload = configFilePhoto("users");
const passport = require("passport");
const scopeValidatior = require("../../../middlewares/handleScopeValidation");
require("../../../utils/strategies/auth/jwt")
module.exports = app => {
  app.get(`${API_PATH}/photos`, 
  passport.authenticate("jwt", { session: false }),
  scopeValidatior(["read:photos"]),
  async (req, res, next) => {
    try {
      const data = await getCategorieOrUser(req.body.idCategorie || req.body.idUser ,next);
      success(res, data, 200);
    } catch (error) {
      next();
    }
  });

  //add photo
  app.post(
    `${API_PATH}/photo`,
    upload.single("file"),
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["create:photos"]),
    async (req, res, next) => {
      try {
        const data = await add(req.body, req.file, next);
        success(res, data, 201);
      } catch (error) {
        next(error);
      }
    }
  );


};
