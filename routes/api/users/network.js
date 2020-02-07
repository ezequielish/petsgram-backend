const API_PATH = "/api";

const { success, error } = require("../../response");
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
  app.get(`${API_PATH}/users`, async (req, res) => {
    const data = await getAll();

    if (data.error) {
      error(res, data.error, 500);
    } else {
      success(res, data, 200);
    }
  });
  app.get(`${API_PATH}/user/:id`, async (req, res) => {
    let id = req.params.id || null;

    const data = await get(id);

    if (data.error) {
      error(res, data.error, 500);
    } else {
      success(res, data, 200);
    }
  });
  app.post(`${API_PATH}/users`, upload.single("file"), async (req, res) => {
    const data = await add(req.body, req.file);

    if (data.error) {
      error(res, data.error, 500);
    } else {
      success(res, data, 201);
    }
  });
  app.patch(`${API_PATH}/user`, async (req, res) => {
    const data = await update(req.body);

    if (data.error) {
      error(res, data.error, 500);
    } else {
      success(res, data, 200);
    }
  });
  app.patch(
    `${API_PATH}/update/image/user/:id`,
    uploadUpdate.single("file"),
    async (req, res) => {

      let id = req.params.id || null;

      const data = await updateFile(id, req.file);

      if (data.error) {
        error(res, data.error, 500);
      } else {
        success(res, data, 200);
      }
    }
  );
  app.delete(`${API_PATH}/user/:id`, async (req, res) => {
    let id = req.params.id || null;

    const data = await deleteUser(id, req.file);

    if (data.error) {
      error(res, data.error, 500);
    } else {
      success(res, data, 200);
    }
  });
  // app.get(`${API_PATH}/films/:id`, async (req, res)=>{
  //     const id = req.params.id;
  //     const resp = await getFilmByID(id);
  //     return res.json(resp);
  // });

  // app.post(`${API_PATH}/film`, async (req, res)=>{
  //     const film = JSON.parse(req.body.film);
  //     if (film) {
  //         const resp = await postFilm(film);
  //         return res.json(resp);
  //     }
  //     res.status(400).send({ reason: "No film sent." });
  // })
};
