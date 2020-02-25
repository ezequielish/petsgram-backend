const API_PATH = "/api";

const { success } = require("../../../network/response");
const {
  add,
  getAll,
  get,
  update,
  updateFile,
  deleteUser
} = require("./controller");
const {
  configFile,
  configFileUpdate
} = require("../../../middlewares/multerFileName");
const upload = configFile("users");
const uploadUpdate = configFileUpdate("users");
const passport = require("passport");
const scopeValidatior = require("../../../middlewares/handleScopeValidation");
require("../../../utils/strategies/auth/jwt");

module.exports = app => {
  app.get(
    `${API_PATH}/users`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["read:user"]),
    async (req, res, next) => {
      try {
        const data = await getAll(next);
        success(res, data, 200);
      } catch (error) {
        next(error);
      }
    }
  );
  app.get(
    `${API_PATH}/user/:id`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["read:users"]),
    async (req, res, next) => {
      try {
        let id = req.params.id || null;

        const data = await get(id, next);

        success(res, data, 200);
      } catch (error) {}
    }
  );

  //add user admin
  app.post(
    `${API_PATH}/admin/user`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["create:user:admin"]),
    upload.single("file"),
    async (req, res, next) => {
      try {
        const data = await add(req.body, req.file, true, next);

        success(res, data, 201);
      } catch (error) {
        next(error);
      }
    }
  );
  //add user
  app.post(
    `${API_PATH}/user`,
    upload.single("file"),
    async (req, res, next) => {      
      try {
        const data = await add(req.body, req.file, false, next);

        success(res, data, 201);
      } catch (error) {
        next(error);
      }
    }
  );

  //update user
  app.patch(
    `${API_PATH}/user`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["update:user"]),
    async (req, res, next) => {
      try {
        const data = await update(req.body,req.user, next);

        success(res, data, 200);
      } catch (error) {
        next(error);
      }
    }
  );

  //update file
  app.patch(
    `${API_PATH}/update/image/user/:id`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["update:user"]),
    uploadUpdate.single("file"),
    async (req, res, next) => {
      try {
        let id = req.params.id || null;

        await updateFile(id, req.user, req.file, next);

        success(res, "", 200);
      } catch (error) {
        next(error)
      }
    }
  );
  app.delete(
    `${API_PATH}/user/:id`,
    passport.authenticate("jwt", { session: false }),
    scopeValidatior(["delete:user"]),
    async (req, res, next) => {
      try {
        let id = req.params.id || null;

        await deleteUser(id, req.user, next);

        success(res, "", 200);
      } catch (error) {
        next(error);
      }
    }
  );
};
