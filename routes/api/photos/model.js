const mongo = require("../../../db/connect");
const { ObjectId } = require("mongodb");
const { name_db } = require("../../../config");

module.exports = {
  add: async function(photo) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db.collection("photos").insertOne(photo);
    return resp;
  },
  // getPhotoQuery: async function(query) {
  //   try {
  //     const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
  //     const resp = await db
  //       .collection("photos")
  //       .aggregate([
  //         {
  //           $lookup: {
  //             from: "users",
  //             localField: "idUser",
  //             foreignField: "_id",
  //             as: "users"
  //           }
  //         },
  //         //   {
  //         //     $project: {
  //         //       like: 1
  //         //     }
  //         //   },
  //         {
  //           $match: {
  //             $or: [
  //               {
  //                 idCategory: new ObjectId(query)
  //               },
  //               {
  //                 idUser: new ObjectId(query)
  //               }
  //             ]
  //           }
  //         }
  //       ])
  //       .toArray(); //hacemos una busqueda segun el id y devolvemos un array

  //     return resp;
  //   } catch (error) {
  //     console.log(error);

  //     return { error: "Algo ha salido mal" };
  //   }
  // },
  getAll: function() {
    const db = mongo.instance().db(name_db); // utilizamos la instancia creada
    const projection = { _id: 1, idCategory: 1, cover: 1, like: 1, liked: 1 };
    const resp = db
      .collection("photos")
      .find({}, { projection })
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
