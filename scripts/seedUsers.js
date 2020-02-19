const bcrypt = require("bcrypt");
const chalk = require("chalk");
const debug = require("debug")("app:scripts:users");
const mongo = require("../db/connect");
const { name_db } = require("../config");
const users = [
  {
    email: "ezequielprophetic@gmail.com",
    name: "ezequiel guerra",
    createAt: new Date(),
    active: false,
    isAdmin: true
  },
  {
    email: "jose@undefined.sh",
    name: "Jose Maria",
    createAt: new Date(),
    active: false
  },
  {
    email: "maria@undefined.sh",
    name: "Maria Jose",
    createAt: new Date(),
    active: false
  }
];
async function initMongo() {
  await mongo.connect(); //nos intentamos conectar a la base de datos
}

async function createUser(user) {
  try {
    const db = await mongo.instance().db(name_db); // utilizamos la instancia creada
    const userCreated = await db.collection("users").insertOne(user);
    return userCreated.ops[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * Le agrega el password a los usaurios
 */
async function hashUsers() {
  const hashedPassword = await bcrypt.hash("secret", 10);

  const nuevosUsuarios = users.map(u => ({
    ...u,
    password: hashedPassword
  }));

  return nuevosUsuarios;
}
function closeApp() {
  mongo.disconnect().then(() => process.exit(0));
}
async function seedUsers() {
  try {
    const usersHashed = await hashUsers(users);

    const saveUsers = usersHashed.map(async user => {
      const userCreated = await createUser(user);
      // debug(chalk.green("User created with id:", userCreated));
      console.log("User created with:", userCreated);
    });

    await Promise.all(saveUsers);
    closeApp();
    process.exit(0);
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}
initMongo();
seedUsers();
