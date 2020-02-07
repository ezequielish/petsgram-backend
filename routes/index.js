const glob = require("glob");
const path = require("path");

module.exports = function(app) {
  glob
    .sync("./routes/api/**/network.js", { ignore: "./routes/index.js"}) //buscamos en todos los directorios dentro de routes usando glob
    .forEach(file => {
      require(path.resolve(file))(app);//le pasamos el app de express
    });
};
