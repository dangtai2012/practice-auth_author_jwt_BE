const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/refresh").post(authController.refreshToken);
router.route("/logout").post(authController.verify, authController.logout);

module.exports = router;
