// controllers/authController.js
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../services/hashService");
const jwtService = require("../services/jwtService");
const crypto = require("crypto");

// In-memory storage for demo purposes (use Redis or DB in production)
const refreshTokenStore = new Map();

// Helper to set cookie for refresh token
const setRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  res.cookie("refreshToken", token, cookieOptions);
};

// ====================== REGISTER ======================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name && email && password))
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate tokens
    const accessToken = jwtService.generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    const refreshToken = jwtService.generateRefreshToken({ id: user._id });

    refreshTokenStore.set(user._id.toString(), refreshToken);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================== LOGIN ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password))
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = jwtService.generateToken({
      id: user._id,
      email: user.email,
    });
    const refreshToken = jwtService.generateRefreshToken({ id: user._id });

    refreshTokenStore.set(user._id.toString(), refreshToken);
    setRefreshTokenCookie(res, refreshToken);

    res.json({ message: "Login successful", accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================== PROFILE (Protected) ======================
exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -passwordResetToken -passwordResetExpires"
  );
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    message: "Welcome to your profile!",
    user,
  });
};

// ====================== LOGOUT ======================
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwtService.verifyRefreshToken(refreshToken);
        if (decoded?.id) refreshTokenStore.delete(decoded.id.toString());
      } catch (_) {}
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== REFRESH TOKEN ======================
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res.status(401).json({ message: "Missing refresh token" });

    let payload;
    try {
      payload = jwtService.verifyRefreshToken(token);
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const stored = refreshTokenStore.get(payload.id.toString());
    if (!stored || stored !== token)
      return res.status(403).json({ message: "Refresh token not recognized" });

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const accessToken = jwtService.generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    const newRefresh = jwtService.generateRefreshToken({ id: user._id });
    refreshTokenStore.set(user._id.toString(), newRefresh);
    setRefreshTokenCookie(res, newRefresh);

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== FORGOT PASSWORD ======================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ message: "If that account exists, a reset link will be sent" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashed;
    user.passwordResetExpires = Date.now() + 1000 * 60 * 15;
    await user.save();

    const resetLink = `${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/reset-password?token=${resetToken}&id=${user._id}`;

    res.json({ message: "Password reset link (demo)", resetLink, resetToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== RESET PASSWORD ======================
exports.resetPassword = async (req, res) => {
  try {
    const { token, id, newPassword } = req.body;
    if (!(token && id && newPassword))
      return res
        .status(400)
        .json({ message: "token, userId and newPassword required" });

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      _id: id,
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired reset token" });

    user.password = await hashPassword(newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    refreshTokenStore.delete(user._id.toString());
    res.clearCookie("refreshToken");

    res.json({ message: "Password reset successful. Please log in again." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
