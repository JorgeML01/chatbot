const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware function to authenticate a token in the request header.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with a status code and message if the token is invalid or missing, otherwise calls the next middleware function.
 */
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  console.log(token);

  if (token == null) return res.status(401).send("Unauthorized");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).send("Invalid token");
    } else {
      req.user = user;
      next();
    }
  });
}

module.exports = { authenticateToken };
