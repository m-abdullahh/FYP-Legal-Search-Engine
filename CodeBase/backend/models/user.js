const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.statics.signUp = async function (name, email, password) {
  //Validation
  if (!email || !password || !name) throw new Error("All fields are required required");
  if (!validator.isEmail(email)) throw new Error("Invalid Email");
  if (!validator.isStrongPassword(password)) throw new Error("Password must be Strong, Backend");

  const exist = await this.findOne({ email });

  if (exist) throw new Error("Email is already taken");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await this.create({ name, email, password: hashedPassword });

  return user;
};

UserSchema.statics.signIn = async function (email, password) {
  if (!email || !password) return res.status(400).json({ message: "All fields are required" });

  const user = await this.findOne({ email });

  if (!user) throw new Error("Incorrect Credentials");
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new Error("Invalid Credentials");
  return user;
};

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
