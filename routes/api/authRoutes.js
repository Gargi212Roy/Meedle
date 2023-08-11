const express = require("express");
const HttpException = require("../../exception/httpException");
const isValidEmail = require("../../utils/isValidEmail");
const generateVerificationCode = require("../../utils/generateVerificationCode");
const bcrypt = require("bcrypt");
const Users = require("../../models/Users");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    if (!req.body) throw new HttpException(400, "Form data absent!!");

    const { name, email, password, confirmPassword } = req.body;

    if (!name) throw new HttpException(400, "Name field cannot be empty");

    if (!email) throw new HttpException(400, "Email field cannot be empty");

    if (!isValidEmail(email))
      throw new HttpException(400, "Invalid email format!");

    if (!password)
      throw new HttpException(400, "Password field cannot be empty");

    if (password.length < 8 || password.length > 20)
      throw new HttpException(
        400,
        "Invalid. Password length should be between 8-20"
      );

    if (!confirmPassword)
      throw new HttpException(400, "Confirm password field cannot be empty");

    if (password !== confirmPassword)
      throw new HttpException(400, "Password should match confirm password");

    const user = await Users.findOne({ email });

    if (user)
      throw new HttpException(400, `User with ${email} already exists!`);

    const verificationCode = generateVerificationCode();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
      verificationCode,
    });

    await newUser.save();

    return res.status(200).json({ success: true, verificationCode });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message || " Sign Up Failed!!" });
  }
});

// EMAIL VERIFICATION

router.post("/verify-email", async (req, res) => {
  try {
    if (!req.body) throw new HttpException(400, "Form data absent!!");

    const { email, verificationCode } = req.body;

    if (!email) throw new HttpException(400, "Email field cannot be empty");

    if (!isValidEmail(email))
      throw new HttpException(400, "Invalid email format!");

    if (!verificationCode)
      throw new HttpException(400, "Verification cide field connt be empty");

    const user = await Users.findOne({ email });

    if (!user)
      throw new HttpException(400, `User with ${email} already exists!`);

    if (user.verificationCode !== verificationCode)
      throw new HttpException(400, "Invalid verification code");

    user.emailVerified = true;
    user.verificationCode = "";

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: `${email} is now verified` });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || " Verifying Email Failed!!",
    });
  }
});

module.exports = router;
