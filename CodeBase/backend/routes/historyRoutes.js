const express = require("express");
const { getSearchHistory, deleteSearchHistory, saveSearchHistory, deleteSingleSearchHistory } = require("../controllers/historyController");
const requireAuth = require("../middleware/requireAuth");
// Get Search History
const router = express.Router();
// Protect all routes in this file

router.use(requireAuth);

// Get Search History
router.get("/", getSearchHistory);

// Save Search History
router.post("/", saveSearchHistory);
// Delete Search History
router.delete("/", deleteSearchHistory);

router.delete("/:historyId", deleteSingleSearchHistory);

module.exports = router;
