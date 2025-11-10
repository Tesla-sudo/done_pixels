// backend/services/jwtService.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Access and refresh secrets
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

// Generate Access Token (short-lived)
exports.generateToken = (payload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
};

// Verify Access Token
exports.verifyToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

// Generate Refresh Token (long-lived)
exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

// Verify Refresh Token
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

// Generate Random Token for Password Reset
exports.generatePasswordResetToken = () => {
  return crypto.randomBytes(20).toString("hex");
};
