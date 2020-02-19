const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config")
const mongo = require("./db/connect");
const passport = require("passport");
const { publicRoute } = require("./config")
const errors = require('./middlewares/errors');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );


app.use(passport.initialize());

require("./routes")(app);// llamamos al enrutador
// require("./routes/users")(app);
app.use(`/${publicRoute}`, express.static('public/app'));
app.use(errors);

async function initMongo(){
    const db = await mongo.connect();//nos intentamos conectar a la base de datos
    if(db) { initExpress(); } //si esta todo OK y se conecta de forma exitosa, avanzamos e iniciamos express.
}

function initExpress() {
    console.log('Iniciando Express');
    const server = app.listen(config.port, ()=>{
        console.log(`Express ha iniciado correctamente! puerto: ${server.address().port}`);
        process.on("SIGINT", closeApp); //Si algo sale mal en el servidor lo cerrmos
        process.on("SIGTERM", closeApp);//Si algo sale mal en el servidor lo cerrmos
    });
}

function closeApp(){
    mongo.disconnect()
        .then(()=>process.exit(0));
}

initMongo();