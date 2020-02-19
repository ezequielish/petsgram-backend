const {
  add,
  getPhotoQuery,
  update,
//   getID,
  updateFile,
  deleteOne
} = require("./model");
const dirName = "photos";
const dirNameUser = "users";
const { ObjectId } = require("mongodb");
const error = require("../../../utils/error");
const PATH_IMG = "./public/app/categories";
const { get: getUser } = require("../users/controller");
const { getID } = require("../categories/model");
const { host, port, publicRoute } = require("../../../config");
const fs = require("fs");

async function addPhoto(data, file, next) {
    
  if (!data.idCategorie || !data.idUser || !file) {
    throw error("Campos inválidos");
  }

  try {
    const user = await getUser(data.idUser);
    const categorie = await getID(data.idCategorie);
    if (!user) {
      throw error("usuario no existe");
    }
    if (!categorie) {
      throw error("categoria no existe");
    }

      let fileUrl = "";
      if (file) {
        fileUrl = `${host}:${port}/${publicRoute}/${dirNameUser}/${user[0].email}/${dirName}/${file.originalname}`;
      }

      const photo = {
        idCategorie: new ObjectId(data.idCategorie),
        idUser: new ObjectId(data.idUser),
        cover: fileUrl,
        like: 0,
        liked: 0,
        createAt: new Date(),
        updateAt: new Date()
      };

      const result = await add(photo);
      return result.ops[0]._id;
  } catch (error) {
    console.error("Error [controller:photo]");
    next(error);
  }
}

  async function getPhotosCategorie(query, next) {

    console.log(query);
    
    try {
      const data = await getPhotoQuery(query);
      return data;
    } catch (error) {
      console.error("Error [controller:categories]");
      next(error);
    }
  }

//   async function updatCategorie(data, next) {
//     const id = data.id;
//     delete data.id;

//     try {
//       const result = await update(data, id);
//       if (result.error) {
//         throw error(result.error);
//       }
//       return id;
//     } catch (error) {
//       console.error("Error [controller:categories]");
//       next(error);
//     }
//   }

//   async function updateCategorieFile(id, file, next) {
//     try {
//       const categorie = await getID(id);
//       if (!categorie.length) {
//         throw error("categoria no existe");
//       }
//       const fileExist = categorie[0].cover;
//       const name = categorie[0].name;

//       if (fileExist) {
//         // si existe eliminamos la foto actual
//         const img = fileExist.split("/")[6];

//         fs.unlink(`${PATH_IMG_CATEGORIES}/${name}/${img}`, err => {
//           if (err) console.log(err);
//         });
//       }
//       let fileUrl = "";
//       if (file) {
//         fileUrl = `${host}:${port}/${publicRoute}/${dirName}/${name}/${file.originalname}`;
//       }

//       const result = await updateFile(fileUrl, id);
//       if (result.error) {
//         throw error(result.error);
//       }
//     } catch (error) {
//       console.error("Error [controller:user]");
//       next(error);
//     }
//   }
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
  getXCategorie: getPhotosCategorie
  // getAll: getCategories,
  // update: updatCategorie,
  // updateFile: updateCategorieFile,
  // deleteCategorie
};
