const {
  add,
  getAll,
  update,
  getID,
  updateFile,
  deleteOne
} = require("./model");
const dirName = "categories";
const error = require("../../../utils/error");
const PATH_IMG_CATEGORIES = "./public/app/categories";
const { host, port, publicRoute } = require("../../../config");
const fs = require("fs");
const hasName = require("../../../utils/hasSpaceName")

async function addCategory(data, file, next) {
  try {
    if (!data.name) {
      throw error("Campos inválidos");
    }

    let fileUrl = "";
    if (file) {
      fileUrl = `${host}:${port}/${publicRoute}/${dirName}/${hasName(data.name)}/${hasName(file.originalname)}`;
    }

    const categorie = {
      name: data.name,
      cover: fileUrl,
      emoji: data.emoji || "",
      createAt: new Date(),
      updateAt: new Date()
    };

    const result = await add(categorie);
    return result.ops[0]._id;
  } catch (error) {
    console.error("Error [controller:categories]");
    next(error);
  }
}

async function getCategories(next) {
  try {
    const data = await getAll();
    return data;
  } catch (error) {
    console.error("Error [controller:categories]");
    next(error);
  }
}

async function updatCategory(data, next) {
  const id = data.id;
  delete data.id;

  try {
    const result = await update(data, id);
    if (result.error) {
      throw error(result.error);
    }
    return id;
  } catch (error) {
    console.error("Error [controller:categories]");
    next(error);
  }
}

async function updateCategoryFile(id, file, next) {
  try {
    const category = await getID(id);
    if (!category.length) {
      throw error("categoria no existe");
    }
    const fileExist = category[0].cover;
    const name = category[0].name;

    if (fileExist) {
      // si existe eliminamos la foto actual
      const img = fileExist.split("/")[6];

      fs.unlink(`${PATH_IMG_CATEGORIES}/${name}/${img}`, err => {
        if (err) console.log(err);
      });
    }
    let fileUrl = "";
    if (file) {
      fileUrl = `${host}:${port}/${publicRoute}/${dirName}/${hasName(name)}/${hasName(file.originalname)}`;
    }

    const result = await updateFile(fileUrl, id);
    if (result.error) {
      throw error(result.error);
    }
  } catch (error) {
    console.error("Error [controller:user]");
    next(error);
  }
}
async function deleteCategory(id, next) {
  try {
    const category = await getID(id);
    if (!category.length) {
      throw error("categoria no existe");
    }

    const fileExist = category[0].cover;
    const name = category[0].name;

    if (fileExist) {
      const img = fileExist.split("/")[6];

      fs.unlink(`${PATH_IMG_CATEGORIES}/${name}/${img}`, err => {
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
  add: addCategory,
  getAll: getCategories,
  update: updatCategory,
  updateFile: updateCategoryFile,
  deleteCategory
};
