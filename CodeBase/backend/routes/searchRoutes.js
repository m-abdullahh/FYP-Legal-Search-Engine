const express = require("express");
const { genericsearch, trademarksearch, judgementclassification, chatbot } = require("../controllers/searchControllers");

const router = express.Router();

// Set the base URL of your Flask API
// Route to handle Generic Search
router.get("/genericsearch", genericsearch);

// Route to handle Trademark Search
router.get("/trademarksearch", trademarksearch);

// Route to handle Judgement Classification
router.get("/judgementclassification", judgementclassification);

// Route to handle ChatBot
router.get("/chatbot", chatbot);

// Export the router
module.exports = router;
