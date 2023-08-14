const express = require("express");

const {
  signUpUser,
  verifyUserEmail,
  userLogIn,
} = require("../../controllers/authControllers");

const router = express.Router();

router.post("/signup", signUpUser);

// EMAIL VERIFICATION

router.post("/verify-email", verifyUserEmail);

router.post("/login", userLogIn);

module.exports = router;
