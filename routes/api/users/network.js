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

module.exports = app => {
  app.get(`${API_PATH}/users`, async (req, res, next) => {
    try {
      const data = await getAll(next);
      success(res, data, 200);
    } catch (error) {
      next(error);
    }
  });
  app.get(`${API_PATH}/user/:id`, async (req, res, next) => {
    try {
      let id = req.params.id || null;

      const data = await get(id, next);

      success(res, data, 200);
    } catch (error) {}
  });

  //add user
  app.post(
    `${API_PATH}/users`,
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

  //update user
  app.patch(`${API_PATH}/user`, async (req, res, next) => {
    try {
      const data = await update(req.body, next);

      success(res, data, 200);
    } catch (error) {
      next(error);
    }
  });

  //update file
  app.patch(
    `${API_PATH}/update/image/user/:id`,
    uploadUpdate.single("file"),
    async (req, res, next) => {
      try {
        let id = req.params.id || null;

        await updateFile(id, req.file, next);

        success(res, "", 200);
      } catch (error) {
        error(res, data.error, 500);
      }
    }
  );
  app.delete(`${API_PATH}/user/:id`, async (req, res, next) => {
    try {
      let id = req.params.id || null;

      await deleteUser(id, req.file, next);

      success(res, "", 200);
    } catch (error) {
      next(error);
    }
  });
};
