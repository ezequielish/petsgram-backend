const API_PATH = "/api";

const { success } = require("../../../network/response");
const {
  add,
  getAll,
  update,
  updateFile,
  deleteCategory
} = require("./controller");
const {
  configFileCategory,
  configFileUpdateCategory
} = require("../../../middlewares/multerFileName");
const upload = configFileCategory("categories");
const uploadUpdate = configFileUpdateCategory("categories");
const passport = require("passport");
const scopeValidatior = require("../../../middlewares/handleScopeValidation");
require("../../../utils/strategies/auth/jwt");

module.exports = app => {
  app.get(`${API_PATH}/categories`, async (req, res, next) => {
    try {
      const data = await getAll(next);
      success(res, data, 200);
    } catch (error) {
      next();
    }
  });

  //add category
  app.post(
    `${API_PATH}/category`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["create:category"]),
    upload.single("file"),
    async (req, res, next) => {
      try {
        const data = await add(req.body, req.file, next);
        success(res, data, 201);
      } catch (error) {
        next(error);
      }
    }
  );

  //update category
  app.patch(
    `${API_PATH}/category`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["update:category"]),
    async (req, res, next) => {
      try {
        const data = await update(req.body, next);

        success(res, data, 200);
      } catch (error) {
        next(error);
      }
    }
  );

  //update file
  app.patch(
    `${API_PATH}/update/image/category/:id`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["update:category"]),
    uploadUpdate.single("file"),
    async (req, res, next) => {
      try {
        let id = req.params.id || null;

        await updateFile(id, req.file, next);

        success(res, "", 200);
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    `${API_PATH}/category/:id`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["delete:category"]),
    async (req, res, next) => {
      try {
        let id = req.params.id || null;

        await deleteCategory(id, next);

        success(res, "", 200);
      } catch (error) {
        next(error);
      }
    }
  );
};
