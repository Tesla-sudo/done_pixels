//routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
console.log(authController);
const authMiddleware = require('../middlewares/authMiddleware');

//Register route
//Users send their name, email, and password to this endpoint
router.post("/register", authController.register);

//Login route
//User send their email and password to receive JWT
router.post("/login", authController.login);

router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

//protected profile route
//Only accessible to authenticated users with valid JWT
router.get("/profile", authMiddleware, authController.profile);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;