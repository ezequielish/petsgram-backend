const API_PATH = "/api";

const { success } = require("../../../network/response");
const { add, getAll, update, updateFile, deleteCategorie } = require("./controller");
const {
  configFileCategorie,
  configFileUpdateCategorie
} = require("../../../middlewares/multerFileName");
const upload = configFileCategorie("categories");
const uploadUpdate = configFileUpdateCategorie("categories");

module.exports = app => {
  app.get(`${API_PATH}/categories`, async (req, res, next) => {
    try {
      const data = await getAll(next);
      success(res, data, 200);
    } catch (error) {
      next();
    }
  });

  //add categorie
  app.post(
    `${API_PATH}/categorie`,
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

  //update categorie
  app.patch(`${API_PATH}/categorie`, async (req, res, next) => {
    try {
      const data = await update(req.body, next);

      success(res, data, 200);
    } catch (error) {
      next(error);
    }
  });

  //update file
  app.patch(
    `${API_PATH}/update/image/categorie/:id`,
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

  app.delete(`${API_PATH}/categorie/:id`, async (req, res, next) => {
    try {
      let id = req.params.id || null;

      await deleteCategorie(id, next);

      success(res, "", 200);
    } catch (error) {
      next(error);
    }
  });
};
