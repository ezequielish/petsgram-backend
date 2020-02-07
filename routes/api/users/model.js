const mongo = require("../../../db/connect");
const { ObjectId } = require("mongodb");
const { name_db } = require("../../../config");

module.exports = {
  getAll: function() {
    const db = mongo.instance().db(name_db); // utilizamos la instancia creada
    const projection = { _id: 1, user: 1, email: 1, file: 1 };
    const resp = db
      .collection("users")
      .find({}, { projection })
      .toArray();
    return resp;
  },
  getID: async function(id) {
    try {
      const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
      const resp = await db
        .collection("users")
        .find({ _id: new ObjectId(id) })
        .toArray(); //hacemos una busqueda segun el id y devolvemos un array

      return resp;
    } catch (error) {
      return { error: "Algo ha salido mal" };
    }
  },
  add: function(user) {
    const db = mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = db.collection("users").insertOne(user);
    return resp;
  },
  update: async function(data, id) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { data } });
    return resp;
  },
  updateFile: async function(url, id) {
    try {
      const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
      const resp = await db
        .collection("users")
        .updateOne({ _id: new ObjectId(id) }, { $set: { file: url } });
      return resp;
    } catch (error) {
      return { error: "Algo ha salido mal" };
    }
  },
  deleteOne: async function(id) {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const resp = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
    return resp;
  }
};
