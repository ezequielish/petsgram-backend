const mongo = require("../../../db/connect");
const { name_db } = require("../../../config");
const { ObjectId } = require("mongodb");

module.exports = {
  add: async function(like) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db.collection("likes").insertOne(like);
    return resp;
  },
  getLikePhotoId: async function(id, email) {
    try {
      const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
      const resp = await db
        .collection("likes")
        .find({ idPhoto: new ObjectId(id), email: email })
        .toArray(); //hacemos una busqueda segun el id y devolvemos un array

      return resp || [];
    } catch (error) {
       
      return { error: "Algo ha salido mal" };
    }
  },

  deleteLike: async function(id, email) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db
      .collection("likes")
      .deleteOne({ idPhoto: new ObjectId(id), email: email });
    return resp;
  }
};
