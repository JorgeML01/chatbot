const { registerUser, getCredentials, getCredentialsNoPass } = require("../services/users.service");
const { isEmail, isPassword } = require("../utils/validator");
const HTTPCodes = require("../utils/HTTPCodes");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * Registers a new user with the given email and password.
 * @async
 * @function register
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the user is registered.
 */
async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    const errorMessages = [];

    console.log(req.body);

    // Verifies if the email and password are valid.
    // if (!isEmail(email)) errorMessages.push("Invalid email");
    // if (!isPassword(password)) errorMessages.push("Invalid password.");

    if (errorMessages.length) {
      res.status(HTTPCodes.BAD_REQUEST).send({ error: errorMessages });
    } else {
      const salt = crypto.randomBytes(128).toString("base64");
      const encryptedPassword = crypto
        .pbkdf2Sync(password, salt, 30000, 64, "sha256")
        .toString("base64");

      const [newUser] = await registerUser({
        ...req.body,
        encryptedPassword,
        salt,
      });

      res.send({ sucess: true, newUser });
    }
  } catch (error) {
    console.log("User already exists.");
    res
      .status(HTTPCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal server error" });
  }
}

/**
 * Authenticates a user with the provided email and password.
 * @async
 * @function login
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.email - The user's email.
 * @param {string} req.body.password - The user's password.
 * @returns {Object} The response object with a success flag and access and refresh tokens if authentication is successful, or an error message if authentication fails.
 */
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const errorMessages = [];

    // if (!isEmail(email)) errorMessages.push("Invalid email");
    // else if (!isPassword(password)) errorMessages.push("Invalid password.");

    if (errorMessages.length) {
      res.status(HTTPCodes.BAD_REQUEST).send({ error: errorMessages });
    } else {
      const [credentials] = await getCredentials(email);

      const encryptedPassword = crypto
        .pbkdf2Sync(password, credentials.salt, 30000, 64, "sha256")
        .toString("base64");

      if (credentials.password === encryptedPassword) {
        const accessToken = jwt.sign(
          {
            email,
            id: credentials.id,
            name: credentials.name,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
          { email, id: credentials.id, name: credentials.name },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1m" }
        );

        res.send({ sucess: true, data: { accessToken, refreshToken } });
      } else {
        res
          .status(HTTPCodes.UNAUTHORIZED)
          .send({ message: "Invalid credentials" });
      }
    }
  } catch (error) {
    res
      .status(HTTPCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "Try again later" });
  }
}

// Controlador para obtener usuario por correo y enviar tokens
async function getUserByEmail(req, res) {
  
  const email = req.params.email; // Obtener el email desde los parámetros de la ruta
  console.log("Email recibido:", email); // Depurar el email recibido

  try {
    const [credentials] = await getCredentials(email);

     // Generar tokens JWT
    const accessToken = jwt.sign(
      {
        email,
        id: credentials.id,
        name: credentials.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { email, id: credentials.id, name: credentials.name },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    res.send({ sucess: true, data: { accessToken, refreshToken } });

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

  } catch (error) {
    console.error("Error fetching user:", error); // Mostrar el error real
    res.status(500).json({ error: "Internal Server Error" });
  }
}



module.exports = { register, login, getUserByEmail };
