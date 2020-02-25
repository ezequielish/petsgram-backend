const multer = require("multer");
const fs = require("fs");
const { publicRoute } = require("../config");
const { getID, getUserEmail } = require("../routes/api/users/model");
const { getID: getIdCategory } = require("../routes/api/categories/model");

const hasName = require("../utils/hasSpaceName");

function configFile(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      if (!req.body.email) {
        let err = {
          message: "email invalido"
        };
        return cb(err, null);
      }
      const emailToValidate = req.body.email;
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      emailValidate = emailRegexp.test(emailToValidate);
      if (!emailValidate) {
        let err = {
          message: "email inválido"
        };
        return cb(err, null);
      }
      const existeUser = await getUserEmail(req.body.email);
      if (existeUser.length) {
        let err = {
          message: "email ya existe"
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
      cb(null, hasName(file.originalname)); // +
    }
  });

  return (upload = multer({ storage }));
}
function configFileUpdate(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      let id = req.params.id || null;
      const idSub = req.user.sub;

      
      if (idSub != id) {
        let err = {
          message: "no autorizado"
        };
        return cb(err);
      }
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
      cb(null, hasName(file.originalname)); // +
    }
  });

  return (upload = multer({ storage }));
}

function configFileCategory(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      if (!req.body.name) {
        let err = {
          message: "categoria invalida"
        };
        return cb(err, null);
      }

      fs.mkdir(
        `public/${publicRoute}/${fileRoute}/${hasName(req.body.name)}`, //creamos el directorio
        { recursive: true },
        err => {
          if (err) throw err;

          cb(
            null,
            `public/${publicRoute}/${fileRoute}/${hasName(req.body.name)}`
          ); //seleccionamos el directorio creado para colocar la imagen
        }
      );
    },
    filename: (req, file, cb) => {
      cb(null, hasName(file.originalname)); // +
    }
  });

  return (upload = multer({ storage }));
}
function configFileUpdateCategory(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      let id = req.params.id || null;
      const category = await getIdCategory(id); // verifico si el id pertenece a un usuario.
      if (!category.length) {
        return cb(null, "");
      }
      const name = category[0].name;
      fs.mkdir(
        `public/${publicRoute}/${fileRoute}/${hasName(name)}`, // creamos un directorio con el email del usuario
        { recursive: true },
        err => {
          if (err) console.log(err);
          cb(null, `public/${publicRoute}/${fileRoute}/${hasName(name)}`);
        }
      );
    },
    filename: (req, file, cb) => {
      cb(null, hasName(file.originalname)); // +
    }
  });

  return (upload = multer({ storage }));
}

function configFilePhoto(fileRoute) {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      if (!req.user.sub || !req.body.idCategory) {
        let err = {
          message: "datos invalidos"
        };
        return cb(err, null);
      }
      const existeUser = await getID(req.user.sub);
      const categorieExiste = await getIdCategory(req.body.idCategory);

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
      cb(null, hasName(file.originalname)); // +
    }
  });

  return (upload = multer({ storage }));
}

module.exports = {
  configFile,
  configFileUpdate,
  configFileCategory,
  configFileUpdateCategory,
  configFilePhoto
};
