const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { validateToken } = require("../middlewares/token");

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/auth/google", userController.googleLogin); // **Google OAuth Route**
router.post("/logout", userController.logout);
router.get("/profile", validateToken, userController.getUserProfile);

module.exports = router;
