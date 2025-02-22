const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { getToken } = require("../middlewares/token");
const bcrypt = require("bcrypt");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ googleId, name, email, picture });
    }

    const jwtToken = getToken(user);

    // **Set JWT in HTTP-Only Cookie**
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true, // Set true in production (HTTPS)
      sameSite: "Strict",
    });

    res.json({ message: "Google Authentication Successful", user });
  } catch (error) {
    res.status(400).json({ error: "Invalid Google Token" });
  }
};

// **Logout Controller**
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out" });
};

// **Protected Route Example**
exports.getUserProfile = (req, res) => {
  res.json({ message: `Welcome ${req.user.name}!`, user: req.user });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      name: name,
    });

    await newUser.save();

    res.status(201).json({
      status: "Success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Registration failed:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        type: "Login",
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = getToken(user);

    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
