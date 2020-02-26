const {
  add,
  getAll,
  getPhotoUser,
  getPhotoCategory,
  getPhotoId,
  update,

} = require("./model");
const dirName = "photos";
const dirNameUser = "users";
const { ObjectId } = require("mongodb");
const error = require("../../../utils/error");
const { get: getUser } = require("../users/controller");
const { getID } = require("../categories/model");
const { host, port, publicRoute } = require("../../../config");
const hasName = require("../../../utils/hasSpaceName")

async function addPhoto(data, user, file, next) {
  
  if (!data.idCategory || !user || !file) {
    throw error("Campos inválidos", 400);
  }

  try {
    const userSelect = await getUser(user.sub);
    const category = await getID(data.idCategory);
    if (!userSelect) {
      throw error("usuario no existe", 400);
    }
    if (!category) {
      throw error("categoria no existe", 400);
    }
    let fileUrl = "";
    if (file) {
      fileUrl = `${host}:${port}/${publicRoute}/${dirNameUser}/${userSelect[0].email}/${dirName}/${hasName(file.originalname)}`;
    }

    const photo = {
      idCategory: new ObjectId(data.idCategory),
      idUser: new ObjectId(user.sub),
      cover: fileUrl,
      likes: 0,
      createAt: new Date(),
      updateAt: new Date()
    };

    const result = await add(photo);
    return result.ops[0]._id;
  } catch (error) {
    console.error("Error [controller:photos]");
    next(error);
  }
}
async function allPhotos(next) {
  try {
    const data = await getAll();
    return data;
  } catch (error) {
    console.log(error);
    
    console.error("Error [controller:photos]");
    next(error);
  }
}
async function PhotosCategory(query, next) {
  if (!query) {
    throw error("categoria no existe");
  }
  try {
    const data = await getPhotoCategory(query);
    return data;
  } catch (error) {
    console.error("Error [controller:photos]");
    next(error);
  }
}
async function photosUser(query, next) {
  if (!query) {
    throw error("usuario no existe");
  }
  try {
    const data = await getPhotoUser(query);
    return data;
  } catch (error) {
    console.error("Error [controller:photos]");
    next(error);
  }
}
async function photoId(query, next) {

  try {
    const data = await getPhotoId(query);
    return data;
  } catch (error) {
    console.error("Error [controller:photos]");
    next(error);
  }
}
async function updateLike(like, id, next) {

  try {
    const data = await update(like, id);
    return data;
  } catch (error) {
    console.error("Error [controller:photos]");
    next(error);
  }
}


//   async function deleteCategorie(id, next) {
//     try {
//       const categorie = await getID(id);
//       if (!categorie.length) {
//         throw error("categoria no existe");
//       }

//       const fileExist = categorie[0].cover;
//       const name = categorie[0].name;

//       if (fileExist) {
//         const img = fileExist.split("/")[6];

//         fs.unlink(`${PATH_IMG_CATEGORIES}/${name}/${img}`, err => {
//           if (err) console.log(err);
//         });
//       }
//       const data = await deleteOne(id);

//       if (data.error) {
//         throw error(result.error);
//       }
//     } catch (error) {
//       console.error("Error [controller:user]");
//       next(error);
//     }
//   }
module.exports = {
  add: addPhoto,
  getXCategory: PhotosCategory,
  getAll: allPhotos,
  getXUser: photosUser,
  getXId: photoId,
  updateLike
  // getAll: getCategories,
  // update: updatCategorie,
  // updateFile: updateCategorieFile,
  // deleteCategorie
};
