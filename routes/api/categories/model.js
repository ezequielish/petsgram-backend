const mongo = require("../../../db/connect");
const { ObjectId } = require("mongodb");
const { name_db } = require("../../../config");

module.exports = {
  getAll: function() {
    const db = mongo.instance().db(name_db); // utilizamos la instancia creada
    // const projection = { _id: 1, user: 1, email: 1, file: 1, name: 1 };
    const resp = db
      .collection("categories")
      .find({})
      .toArray();
    return resp;
  },
  getID: async function(id) {
    try {
      const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
      const resp = await db
        .collection("categories")
        .find({ _id: new ObjectId(id) })
        .toArray(); //hacemos una busqueda segun el id y devolvemos un array

      return resp;
    } catch (error) {
      return { error: "Algo ha salido mal" };
    }
  },

  add: async function(categorie) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db.collection("categories").insertOne(categorie);
    return resp;
  },
  update: async function(data, id) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db
      .collection("categories")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updateAt: new Date() } }
      );
    return resp;
  },
  updateFile: async function(url, id) {
    try {
      const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
      const resp = await db
        .collection("categories")
        .updateOne({ _id: new ObjectId(id) }, { $set: { file: url } });
      return resp;
    } catch (error) {
      return { error: "Algo ha salido mal" };
    }
  },
  deleteOne: async function(id) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db
      .collection("categories")
      .deleteOne({ _id: new ObjectId(id) });
    return resp;
  }
};
