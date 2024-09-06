const express = require("express");
const router = express.Router();
const ChatbotController = require("../controllers/chatbot.controller");

router.post("/detectIntent", ChatbotController.detectIntent);

module.exports = router;