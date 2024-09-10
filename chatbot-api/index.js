
const express = require("express");
const app = express();


const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const UserRouter = require("./src/routes/users.route");
const ChatbotRouter = require("./src/routes/chatbot.route");
const PhotosRouter = require("./src/routes/photos.route");

require("dotenv").config();

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(cors());
app.use(cookieParser());
app.use(UserRouter);
app.use(ChatbotRouter);
app.use(PhotosRouter);

app.listen(8080);
