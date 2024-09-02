
const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const UserRouter = require("./src/routes/users.route");

require("dotenv").config();

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(cors());
app.use(cookieParser());
app.use(UserRouter);



app.listen(8080);
