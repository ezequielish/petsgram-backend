const multer = require("multer");
const fs = require("fs");
const { publicRoute } = require("../config");
const { getID } = require("../routes/api/users/model");
function configFile(fileRoute) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdir(
        `public/${publicRoute}/${fileRoute}/${req.body.email}`,
        { recursive: true },
        err => {
          if (err) throw err;

          cb(null, `public/${publicRoute}/${fileRoute}/${req.body.email}`);
        }
      );
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // +
    }
  });

  return (upload = multer({ storage }));
}
function configFileUpdate(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      let id = req.params.id || null;
      const user = await getID(id);// verifico si el id pertenece a un usuario.
      if (!user.length) {
        return cb(null, "");
      }
      const email = user[0].email;
      fs.mkdir(
        `public/${publicRoute}/${fileRoute}/${req.body.email}`,// creamos un directorio con el email del usuario
        { recursive: true },
        err => {
          if (err) console.log(err);
          cb(null, `public/${publicRoute}/${fileRoute}/${email}`); 
        }
      );
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // +
    }
  });

  return (upload = multer({ storage }));
}

module.exports = {
  configFile,
  configFileUpdate
};
