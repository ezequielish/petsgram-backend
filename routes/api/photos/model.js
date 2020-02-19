const mongo = require("../../../db/connect");
const { ObjectId } = require("mongodb");
const { name_db } = require("../../../config");

module.exports = {
  add: async function(photo) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db.collection("photos").insertOne(photo);
    return resp;
  },
  getPhotoQuery: async function(query) {
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
              as: "users"
            }
          },
          //   {
          //     $project: {
          //       like: 1
          //     }
          //   },
          {
            $match: {
              $or: [
                {
                  idCategorie: new ObjectId(query)
                },
                {
                  idUser: new ObjectId(query)
                }
              ]
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
