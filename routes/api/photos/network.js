const API_PATH = "/api";

const { success } = require("../../../network/response");
const {
  add,
  getXCategory,
  getAll,
  getXUser,
  getXId,
  deletePhoto
} = require("./controller");
const { configFilePhoto } = require("../../../middlewares/multerFileName");
const upload = configFilePhoto("users");
const passport = require("passport");
const scopeValidatior = require("../../../middlewares/handleScopeValidation");
require("../../../utils/strategies/auth/jwt");
module.exports = app => {
  app.get(`${API_PATH}/photos`, async (req, res, next) => {
    try {
      const data = await getAll();
      success(res, data, 200);
    } catch (error) {
      next();
    }
  });

  app.get(`${API_PATH}/photos/category/:category`, async (req, res, next) => {
    try {
      const data = await getXCategory(req.params.category);
      success(res, data, 200);
    } catch (error) {
      next();
    }
  });
  app.get(`${API_PATH}/photos/user/:user`, async (req, res, next) => {
    try {
      const data = await getXUser(req.params.user);
      success(res, data, 200);
    } catch (error) {
      next();
    }
  });
  app.get(`${API_PATH}/photos/detail/:id`, async (req, res, next) => {
    try {
      const data = await getXId(req.params.id);
      success(res, data, 200);
    } catch (error) {
      next();
    }
  });
  // app.get(`${API_PATH}/photos/:user`,
  // passport.authenticate("jwt", { session: false }),
  // scopeValidatior(["read:photos"]),
  // async (req, res, next) => {
  //   try {
  //     const data = await getCategorie(req.params.category);
  //     success(res, data, 200);
  //   } catch (error) {
  //     next();
  //   }
  // });
  //add photo
  app.post(
    `${API_PATH}/photo`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["create:photos"]),
    upload.single("file"),

    async (req, res, next) => {
      
      try {
        const data = await add(req.body, req.user, req.file, next);
        success(res, data, 201);
      } catch (error) {
        next(error);
      }
    }
  );
};
