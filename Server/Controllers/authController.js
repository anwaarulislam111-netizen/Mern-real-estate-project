import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../db.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signup = async (req, res) => {
  await connectDB();
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    await new UserModel({ username, email, password: hashedPassword }).save();

    return res.status(200).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message || "An error occurred" });
  }
};

export const signin = async (req, res) => {
  await connectDB();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Both email and password are required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid email. User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, cookieOptions);

    const { password: userPassword, ...userData } = user._doc;
    return res.status(200).json({ success: true, message: "User logged in successfully", user: userData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "An error occurred" });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ success: true, message: "User signed out successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Failed to sign out" });
  }
};
