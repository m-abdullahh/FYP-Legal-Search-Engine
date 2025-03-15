const User = require("../models/user");
const jwt = require("jsonwebtoken");
//registerUser

const createtoken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET || "legalsearchenginefypjwtsecret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

exports.registerUser = async (req, res) => {
  console.log("REGISTER", req.body);
  const { name, email, password } = req.body;
  try {
    const user = await User.signUp(name, email, password);

    const token = createtoken(user._id);
    res.status(200).json({ name, email, token });
  } catch (error) {
    console.log("REGISTER ERROR", error.message);
    res.status(400).json({ error: error.message });
  }
};

//! Login a user
exports.loginUser = async (req, res) => {
  console.log("LOGIN", req.body);
  const { email, password } = req.body;

  try {
    const user = await User.signIn(email, password);
    const token = createtoken(user._id);

    res.status(200).json({ name: user.name, email, token });
  } catch (error) {
    console.log("LOGIN ERROR", error.message);
    res.status(400).json({ message: error.message });
  }
};
