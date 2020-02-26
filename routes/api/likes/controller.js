const { add } = require("./model");
const { getXId, updateLike } = require("../photos/controller");
const { getLikePhotoId, deleteLike } = require("./model");
const error = require("../../../utils/error");
const { ObjectId } = require("mongodb");

async function addLike(user, idPhoto, next) {
  if (!user.sub || !idPhoto) {
    throw error("Campos inválidos", 400);
  }
  try {
    const photo = await getXId(idPhoto);
    if (!photo) {
      throw error("la foto no existe", 400);
    }

    const fileExist = await getLikePhotoId(idPhoto, user.email);

    if (fileExist.length) {
      const likes = parseInt(photo[0].likes) - 1;

      await updateLike(likes, idPhoto);

      await deleteLike(idPhoto, user.email);//lo borramos de la coleccion like  
    }

    const likes = parseInt(photo[0].likes) + 1;
    await updateLike(likes, idPhoto);//sumamos el like
    const like = {
      email: user.email,
      idPhoto: new ObjectId(idPhoto),
      createAt: new Date(),
      updateAt: new Date()
    };

    await add(like);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  add: addLike
};
