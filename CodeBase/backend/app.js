const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const { mongoose } = require("mongoose");
const dotenv = require("dotenv");
const app = express();

// Load environment variables from .env file
dotenv.config({ path: `${process.cwd()}/.env` });

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "your_default_mongo_connection_string")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// MIDDLEWARES
app.use(express.json());
app.use(cookieparser());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("NODE SERVER IS LIVE");
});

// API routes
app.use("/", require("./routes/userRoutes"));
app.use("/search", require("./routes/searchRoutes"));
app.use("/searchhistory", require("./routes/historyRoutes"));

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port: ${port}`);
});
