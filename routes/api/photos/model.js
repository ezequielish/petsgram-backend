const mongo = require("../../../db/connect");
const { ObjectId } = require("mongodb");
const { name_db } = require("../../../config");

module.exports = {
  add: async function(photo) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db.collection("photos").insertOne(photo);
    return resp;
  },
  update: async function(like, id) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db
      .collection("photos")
      .updateOne({ _id: new ObjectId(id) }, { $set: { likes: like, updateAt: new Date() } });
    return resp;
  },
  getAll: function() {
    const db = mongo.instance().db(name_db); // utilizamos la instancia creada
    const projection = { _id: 1, idCategory: 1, cover: 1, like: 1 };
    const resp = db
      .collection("photos")
      .aggregate([
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "idPhoto",
            as: "photo_like"
          }
        },

        {
          $project: {
            ...projection,
            photo_like: {
              email: 1
            },
          }
        }
      ])
      .toArray();
    return resp;
  },
  getPhotoCategory: async function(query) {
    try {
      const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
      const resp = await db
        .collection("photos")
        .find({ idCategory: new ObjectId(query) })
        .toArray(); //hacemos una busqueda segun el id y devolvemos un array

      return resp;
    } catch (error) {
      console.log(error);

      return { error: "Algo ha salido mal" };
    }
  },
  getPhotoUser: async function(query) {
    try {
      const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
      const resp = await db
        .collection("photos")
        .find({ idUser: new ObjectId(query) })
        .toArray(); //hacemos una busqueda segun el id y devolvemos un array

      return resp;
    } catch (error) {
      console.log(error);

      return { error: "Algo ha salido mal" };
    }
  },
  getPhotoId: async function(query) {
    try {
      const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
      const resp = await db
        .collection("photos")
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "idUser",
              foreignField: "_id",
              as: "user"
            }
          },
          // {
          //   $project: {
          //     projection
          //   }
          // },
          {
            $match: {
              _id: new ObjectId(query)
            }
          }
        ])
        .toArray(); //hacemos una busqueda segun el id y devolvemos un array

      return resp;
    } catch (error) {
      console.log(error);

      return { error: "Algo ha salido mal" };
    }
  }
};
