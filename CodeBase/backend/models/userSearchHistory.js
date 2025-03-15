const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  searchType: {
    type: String,
    enum: ["generic", "trademark", "judgment"], // Example types, you can modify as needed
    required: true,
  },
  query_data: {
    type: mongoose.Schema.Types.Mixed, // Flexible to store different types of query data
    required: true,
  },
  case_type: {
    type: String, // Flexible to store different types of query data
    enum: ["copright", "trademark", "judgment"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Static method to get search history for a user
searchHistorySchema.statics.getSearchHistoryByUser = async function (userId) {
  try {
    const history = await this.find({ userId }).sort({ timestamp: -1 });
    return history;
  } catch (error) {
    throw new Error("Failed to retrieve search history: " + error.message);
  }
};

// Static method to delete search history for a user
searchHistorySchema.statics.deleteSearchHistoryByUser = async function (userId) {
  console.log("Delete Search History by User called")

  try {
    await this.deleteMany({ userId });
    return { message: "Search history deleted successfully" };
  } catch (error) {
    throw new Error("Failed to delete search history: " + error.message);
  }
};

// Static method to save a new search history entry
searchHistorySchema.statics.saveSearchHistory = async function (userId, searchType, query_data, case_type = "trademark") {
  try {
    const newHistory = new this({
      userId,
      searchType,
      query_data,
      case_type
    });
    const savedHistory = await newHistory.save(); // Save and retrieve the full saved document
    return savedHistory; // Return the full saved entry, including _id
  } catch (error) {
    throw new Error("Failed to save search history: " + error.message);
  }
};

searchHistorySchema.statics.deleteSearchHistoryById = async function (userId, historyId) {
  console.log("Delete Search History by ID called")
  return await this.findOneAndDelete({
    _id: historyId,
    userId: userId, // Ensure the user can only delete their own history
  });
};

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

module.exports = SearchHistory;
