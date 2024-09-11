const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controller");
//const { authenticateToken } = require("../middlewares/middleware");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/user/:email", UserController.getUserByEmail);

module.exports = router;
