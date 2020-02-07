const MongoClient = require("mongodb").MongoClient;// 
const config = require("../config");
const connString = `mongodb://${config.host_db}:${config.port_db}`;//ruta para conectarnos a la db de mongo

let instance = null;
let isDisconnecting = false;

module.exports = {
    connect: () => {
        return new Promise((resolve, reject)=>{
            MongoClient.connect(connString, { useUnifiedTopology: true }, function(err, client) { //nos conectamos a la base de datos
                if (err) { reject(err); } //callback error first
                console.log("Conectado satisfactoriamente al servidor de Mongo!");
                instance = client;// creamos la instancia con el cliente conectado
                resolve(client.db(config.name_db));
            });
        });
    },
    disconnect: () => {
        if (instance && !isDisconnecting){
            isDisconnecting = true;
            console.log("Desconectando instancia de Mongo");
            return new Promise((resolve, reject)=>{
                instance.close((err, result)=>{  //nos desconectamos de la base de datos
                    if (err) { reject(err); isDisconnecting=false; return; } //callback error first
                    console.log("Instancia de Mongo desconectada!");
                    resolve();
                });
            })
        }
    },
    instance: () => {
        return instance;
    }
};