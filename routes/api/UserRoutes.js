const express = require("express");
const Users = require("../../models/Users");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Creating and posting user details
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    if (name.length < 2) {
      return res
        .status(400)
        .json({ error: "Name should have at least 2 characters." });
    }

    // Password validation using regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password should be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.",
      });
    }

    const newUser = new Users({
      name,
      email,
      password,
    });

    const createdUser = await newUser.save();
    res.status(200).json({ id: createdUser.id, name, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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
