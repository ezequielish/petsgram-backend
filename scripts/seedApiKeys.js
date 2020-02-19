// DEBUG=app:* node scripts/mongo/seedApiKeys.js

const chalk = require("chalk");
const crypto = require("crypto");
const debug = require("debug")("app:scripts:api-keys");
const mongo = require("../db/connect");
const { name_db } = require("../config");

//scopes a que tendra permisos el token admin y public
const adminScopes = [
  "signin:auth",
  "signup:auth",
  "read:user",
  "read:users",
  "create:user",
  "update:user",
  "delete:user"
];

const publicScopes = [
  "signin:auth",
  "signup:auth",
  "read:user",
  "create:user",
  "update:user"
];
//Generamos api key ramdom para que se genere api distintas siempre que se corra el script, asi agregamos más seguridad ya que cada vez que se use el proyecto generara api tokens distintos.
const apiKeys = [
  {
    token: generateRandomToken(),
    scopes: adminScopes
  },
  {
    token: generateRandomToken(),
    scopes: publicScopes
  }
];

function generateRandomToken() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString("hex");
}

// async function initMongo() {
//    //nos intentamos conectar a la base de datos
// }

async function createApiKeys(apiKey, db) {
  try {
    const apiKeyCreated = await db.collection("apikeys").insertOne(apiKey);
    return apiKeyCreated.ops[0];
  } catch (error) {
    console.log(error);
  }
}
function closeApp() {
  mongo.disconnect().then(() => process.exit(0));
}

async function seedApiKeys() {
  const db = await mongo.connect();
  try {
    const promises = apiKeys.map(async apiKey => {
      const apiKeyCreated = await createApiKeys(apiKey, db);

      console.log("Api key created with:", apiKeyCreated);
    });

    // debug(chalk.green(`${promises.length} api keys have been created succesfully`)); // prettier-ignore
    await Promise.all(promises);
    closeApp();
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}

// initMongo();
seedApiKeys();
