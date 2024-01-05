const express = require("express");
const Users = require("../../models/Users");
const router = express.Router();
const { updateName } = require("../../controllers/userControllers");
const { authenticate } = requiew("../../middlewares/authenticate");
// updating name
router.put("/", authenticate, updateName);

// fetching /getting user details
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ err: `User with the emaik ${email} does not exist` });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ err });
  }
});

// Getting all users
router.get("/users", async (req, res) => {
  try {
    const allUsers = await Users.find();

    res.status(200).json(allUsers);
  } catch (err) {
    res.status(400).json({ err });
  }
});

// Updating user details
router.put("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { name } = req.body;

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    // Fetch the existing user
    const existingUser = await Users.findOne({ email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ error: `User with the email ${email} does not exist` });
    }
    // Check if the new name is not null and different from the old name
    if (!name || name === existingUser.name) {
      return res.status(400).json({
        error: "New name must be provided and different from the old name.",
      });
    }

    // Update the user's name
    existingUser.name = name;
    const updatedUser = await existingUser.save();

    res.status(200).json({ name: updatedUser.name, email: updatedUser.email });
  } catch (err) {
    res.status(400).json({ err });
  }
});

// Deleting user
router.delete("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    const user = await Users.findOneAndDelete({ email });

    if (!user) {
      return res
        .status(404)
        .json({ err: `User with the email ${email} does not exist` });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = router;
