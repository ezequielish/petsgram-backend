const {
  add,
  getAll,
  getID,
  update,
  updateFile,
  deleteOne
} = require("./model");

const PATH_IMG_USER = "./public/app/users";
const { host, port, publicRoute } = require("../../../config");
const fs = require("fs");

const hashUser = (data, fileUrl) => {
  const user = {
    name: data.name,
    email: data.email,
    file: fileUrl,
    createAt: new Date(),
    active: true
    // online: true
  };
  return user;
};
async function postUser(data, file) {
  try {
    if (!data.name || !data.email) {
      throw "Campos inválidos";
    }

    let fileUrl = "";
    if (file) {
      fileUrl = `${host}:${port}/${publicRoute}/users/${data.email}/${file.originalname}`;
    }

    const user = await hashUser(data, fileUrl);
    const result = await add(user);

    return result.ops[0];
  } catch (error) {
    console.error("Error [controller:user]");
    return { error };
  }
}

async function getUsers() {
  try {
    const data = await getAll();

    return data;
  } catch (error) {
    console.error("Error [controller:user]");
    return { error };
  }
}
async function getUser(id) {
  try {
    const data = await getID(id);
    if (!data.length) {
      throw "usuario no existe";
    }
    if (data.error) {
      throw data.error;
    }
    return data;
  } catch (error) {
    console.error("Error [controller:user]");
    return { error };
  }
}
async function updateUser(data) {
  const id = data.id;
  delete data.id;

  try {
    const result = await update(data, id);

    if (result.error) {
      throw result.error;
    }
    return id;
  } catch (error) {
    console.error("Error [controller:user]");
    return { error };
  }
}

async function updateUserFile(id, file) {
  try {
    const user = await getUser(id);
    if (!user.length) {
      throw "usuario no existe";
    }
    const fileExist = user[0].file;
    const email = user[0].email;

    if (fileExist) {
      const img = fileExist.split("/")[6];

      fs.unlink(`${PATH_IMG_USER}/${email}/${img}`, err => {
        if (err) console.log(err);
      });
    }
    let fileUrl = "";
    if (file) {
      fileUrl = `${host}:${port}/${publicRoute}/users/${email}/${file.originalname}`;
    }

    const result = await updateFile(fileUrl, id);
    if (result.error) {
      throw result.error;
    }
    return "OK";
  } catch (error) {
    console.error("Error [controller:user]");
    return { error };
  }
}
async function deleteUser(id) {
  try {
    const user = await getUser(id);
    if (!user.length) {
      throw "usuario no existe";
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
      throw data.error;
    }
    return "OK";
  } catch (error) {
    console.error("Error [controller:user]");
    return { error };
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
