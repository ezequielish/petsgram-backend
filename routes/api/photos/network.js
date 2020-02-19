const API_PATH = "/api";

const { success } = require("../../../network/response");
const { add, getXCategorie, deletePhoto } = require("./controller");
const {
    configFilePhoto
} = require("../../../middlewares/multerFileName");
const upload = configFilePhoto("users");

module.exports = app => {
  app.get(`${API_PATH}/photos`, async (req, res, next) => {
    try {
      const data = await getXCategorie(req.body.idCategorie || req.body.idUser ,next);
      success(res, data, 200);
    } catch (error) {
      next();
    }
  });

  //add photo
  app.post(
    `${API_PATH}/photo`,
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


};
