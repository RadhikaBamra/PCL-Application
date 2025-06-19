require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { fullName, email, password, role, institution, rollNumber, adminKey } =
    req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (role === "User" && !institution) {
    return res
      .status(400)
      .json({ message: "Institution is required for users" });
  }

  if (role === "Scientist" && !rollNumber) {
    return res
      .status(400)
      .json({ message: "Roll number is required for scientists" });
  }

  if (role === "Admin") {
    const SYSTEM_ADMIN_KEY = process.env.ADMIN_KEY;
    if (adminKey !== SYSTEM_ADMIN_KEY) {
      return res.status(403).json({ message: "Invalid admin key" });
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
    role,
    institution,
    rollNumber,
  });

  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.status(201).json({
    success: true,
    message: "Signup successful",
    token,
    role: user.role,
    fullName: user.fullName,
    email: user.email,
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    if (role.trim().toLowerCase() !== user.role.trim().toLowerCase()) {
      return res.status(403).json({ message: "Invalid role for this user" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      institution: user.institution,
      rollNumber: user.rollNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
