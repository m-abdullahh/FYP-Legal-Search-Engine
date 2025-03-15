const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers; // Get the Authorization header
  if (!authorization) return res.status(401).json({ error: "Authorization Token Required" });

  const token = authorization.split(" ")[1]; // Extract the token from the header

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET || "legalsearchenginefypjwtsecret");
    req.user = await userModel.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    return res.status(401).json({ error: "Request is not Authorized" });
  }
};
module.exports = requireAuth;
