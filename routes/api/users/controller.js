const {
  add,
  getUserEmail,
  getAll,
  getID,
  update,
  updateFile,
  deleteOne
} = require("./model");
const bcrypt = require("bcrypt");
const error = require("../../../utils/error");
const PATH_IMG_USER = "./public/app/users";
const { host, port, publicRoute, apiKeyScopeAdmin, apiKeyScopePublic } = require("../../../config");
const fs = require("fs");

const hashUser = async (data, fileUrl, isAdmin) => {
  const user = {
    name: data.name,
    email: data.email,
    file: fileUrl,
    createAt: new Date(),
    updateAt: new Date(),
    active: true,
    password: await bcrypt.hash(data.password, 10),
    scope: isAdmin ? apiKeyScopeAdmin : apiKeyScopePublic 
    // online: true
  };
  return user;
};
async function postUser(data, file, isAdmin, next) {
  if (!data.name || !data.email || !data.password) {
    throw error("Campos inválidos");
  }
  try {
    let fileUrl = "";
    if (file) {
      fileUrl = `${host}:${port}/${publicRoute}/users/${data.email}/${file.originalname}`;
    }

    const existeUser = await getUserEmail(data.email);
    if (existeUser.length) {
      throw error("email ya existe");
    }

    const user = await hashUser(data, fileUrl, isAdmin);
    const result = await add(user);
    // delete result.ops[0].password
    return result.ops[0]._id;
  } catch (error) {
    console.error("Error [controller:user]");
    next(error);
  }
}

async function getUsers(next) {
  try {
    const data = await getAll();
    // throw error("Campos inválidos", 401)
    return data;
  } catch (error) {
    console.error("Error [controller:user]");
    next(error);
  }
}
async function getUser(id, next) {
  try {
    const data = await getID(id);
    if (!data.length) {
      throw error("usuario no existe");
    }
    if (data.error) {
      throw error(data.error);
    }
    return data;
  } catch (error) {
    console.error("Error [controller:user]");
    next(error);
  }
}
async function updateUser(data, next) {
  const id = data.id;
  delete data.id;
  try {
    const result = await update(data, id);
    if (result.error) {
      throw error(result.error);
    }
    return id;
  } catch (error) {
    console.error("Error [controller:user]");
    next(error);
  }
}

async function updateUserFile(id, file) {
  try {
    const user = await getUser(id);
    if (!user.length) {
      throw error("usuario no existe");
    }
    const fileExist = user[0].file;
    const email = user[0].email;

    if (fileExist) {
      // si existe eliminamos la foto actual
      const img = fileExist.split("/")[6];

      fs.unlink(`${PATH_IMG_USER}/${email}/${img}`, err => {
        if (err) console.log(err);
      });

      // fs.unlink(`${PATH_IMG_USER}/${email}/${img}`, err => {
      //   if (err) console.log(err);
      // });
    }
    let fileUrl = "";
    if (file) {
      fileUrl = `${host}:${port}/${publicRoute}/users/${email}/${file.originalname}`;
    }

     await updateFile(fileUrl, id);
 
  } catch (error) {
    console.error("Error [controller:user]");
    next(error);
  }
}
async function deleteUser(id, next) {
  try {
    const user = await getUser(id);
    if (!user.length) {
      throw error("usuario no existe");
    }

    const fileExist = user[0].file;

    const email = user[0].email;

    if (fileExist) {
      const img = fileExist.split("/")[6];

      fs.unlink(`${PATH_IMG_USER}/${email}/${img}`, err => {
        if (err) console.log(err);
      });
    }
    const data = await deleteOne(id);

    if (data.error) {
      throw error(result.error);
    }
  } catch (error) {
    console.error("Error [controller:user]");
    next(error);
  }
}
module.exports = {
  add: postUser,
  getAll: getUsers,
  get: getUser,
  update: updateUser,
  updateFile: updateUserFile,
  deleteUser
};
