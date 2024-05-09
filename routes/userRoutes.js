const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/").get(authController.verify, userController.getAllUser);

router
  .route("/:id")
  .delete(
    authController.verify,
    authController.restrictTo,
    userController.deleteUser
  );

module.exports = router;
