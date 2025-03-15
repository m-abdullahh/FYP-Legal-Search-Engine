const SearchHistory = require("../models/userSearchHistory");

const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await SearchHistory.getSearchHistoryByUser(userId);

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Search History for the logged-in user
const deleteSearchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const response = await SearchHistory.deleteSearchHistoryByUser(userId);

    res.status(200).json({
      success: true,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Save Search History (This is usually invoked within a search operation)
const saveSearchHistory = async (req, res) => {
  const { searchType, query_data } = req.body;
  const userId = req.user._id; // Assuming user is logged in and authenticated
  console.log("Save History Called", userId, searchType, query_data);

  try {
    const response = await SearchHistory.saveSearchHistory(userId, searchType, query_data);
    res.status(200).json({
      success: true,
      history: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSingleSearchHistory = async (req, res) => {
  const { historyId } = req.params; // Extract the historyId from request params
  console.log("Delete Single History Called", historyId);
  const userId = req.user._id; // Get user ID from authenticated user

  try {
    const response = await SearchHistory.deleteSearchHistoryById(userId, historyId);

    if (!response) {
      console.log("Search history entry deleted successfully")
      return res.status(404).json({
        success: false,
        message: "Search history entry not found",
      });
    }

    console.log("Search history entry deleted successfully")
    res.status(200).json({
      success: true,
      message: "Search history entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSearchHistory,
  deleteSearchHistory,
  saveSearchHistory,
  deleteSingleSearchHistory,
};
