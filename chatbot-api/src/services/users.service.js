require("dotenv").config();

// Cloud
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
      // Enable SSL/TLS
      rejectUnauthorized: false, // Reject unauthorized connections
    },
  },
});

const registerUser = async (user) => {
  try {
    return await knex("users").insert({
      email: user.email,
      password: user.encryptedPassword,
      salt: user.salt,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCredentials = async (email) => {
  let credentials = await knex
    .select("password", "salt", "id", "name")
    .from("users")
    .where("email", email);
  credentials = JSON.stringify(credentials);

  return JSON.parse(credentials);
};

const getCredentialsNoPass = async (email) => {
  let credentials = await knex
    .select("id", "name")
    .from("users")
    .where("email", email);
  credentials = JSON.stringify(credentials);

  return JSON.parse(credentials);
};


module.exports = {
  getCredentials,
  getCredentialsNoPass,
  registerUser,
};
