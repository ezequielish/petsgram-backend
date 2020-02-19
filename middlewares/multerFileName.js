const multer = require("multer");
const fs = require("fs");
const { publicRoute } = require("../config");
const { getID, getUserEmail } = require("../routes/api/users/model");
const { getID: getIDCategorie } = require("../routes/api/categories/model");

function configFile(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      if (!req.body.email) {
        let err = {
          message: "email invalido"
        };
        return cb(err, null);
      }
      const existeUser = await getUserEmail(req.body.email);
      if (existeUser.length) {
        let err = {
          message: "email ya existes"
        };
        return cb(err, null);
      }

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
      const user = await getID(id); // verifico si el id pertenece a un usuario.
      if (!user.length) {
        return cb(null, "");
      }
      const email = user[0].email;
      fs.mkdir(
        `public/${publicRoute}/${fileRoute}/${email}`, // creamos un directorio con el email del usuario
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

function configFileCategorie(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      if (!req.body.name) {
        let err = {
          message: "categoria invalida"
        };
        return cb(err, null);
      }

      fs.mkdir(
        `public/${publicRoute}/${fileRoute}/${req.body.name}`, //creamos el directorio
        { recursive: true },
        err => {
          if (err) throw err;

          cb(null, `public/${publicRoute}/${fileRoute}/${req.body.name}`); //seleccionamos el directorio creado para colocar la imagen
        }
      );
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // +
    }
  });

  return (upload = multer({ storage }));
}
function configFileUpdateCategorie(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      let id = req.params.id || null;
      const categorie = await getIDCategorie(id); // verifico si el id pertenece a un usuario.
      if (!categorie.length) {
        return cb(null, "");
      }
      const name = categorie[0].name;
      fs.mkdir(
        `public/${publicRoute}/${fileRoute}/${name}`, // creamos un directorio con el email del usuario
        { recursive: true },
        err => {
          if (err) console.log(err);
          cb(null, `public/${publicRoute}/${fileRoute}/${name}`);
        }
      );
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // +
    }
  });

  return (upload = multer({ storage }));
}

function configFilePhoto(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      if (!req.body.idUser || !req.body.idCategorie) {
        let err = {
          message: "usuario invalido"
        };
        return cb(err, null);
      }
      const existeUser = await getID(req.body.idUser);
      const categorieExiste = await getIDCategorie(req.body.idCategorie);

      if (!categorieExiste.length) {
        let err = {
          message: "categoria no existe"
        };
        return cb(err, null);
      }
      if (!existeUser.length) {
        let err = {
          message: "usuario no existe"
        };
        return cb(err, null);
      }

      const email = existeUser[0].email;
      fs.mkdir(
        `public/${publicRoute}/${fileRoute}/${email}/photos`,
        { recursive: true },
        err => {
          if (err) throw err;

          cb(null, `public/${publicRoute}/${fileRoute}/${email}/photos`);
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
  configFileUpdate,
  configFileCategorie,
  configFileUpdateCategorie,
  configFilePhoto
};
