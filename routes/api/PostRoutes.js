const express = require("express");
const Users = require("../../models/Users");
const Posts = require("../../models/Posts");
const router = express.Router();

// creation of post
router.post("/:email/posts", async (req, res) => {
  try {
    const { email } = req.params;
    const { title, content } = req.body;

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    // Title and content checks
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with the email ${email} does not exist` });
    }

    const newPost = new Posts({
      title,
      content,
      user: user.id,
    });

    await newPost.save();
    res.status(200).json({ title, content });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Updating a post--> validate inputs
router.put("/:email/posts/:postId", async (req, res) => {
  try {
    const { email, postId } = req.params;
    const { title, content } = req.body;

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Title and content checks
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are empty." });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with the email ${email} does not exist` });
    }

    const post = await Posts.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ error: `Post with the _id ${postId} does not exist` });
    }

    if (post.user !== user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      { $set: { title, content } },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Getting all posts of a single user
router.get("/:email/posts", async (req, res) => {
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
        .json({ error: `User with the email ${email} does not exist` });
    }

    const userPosts = await Posts.find({ user: user.id });

    if (!userPosts || userPosts.length === 0) {
      return res.status(404).json({ error: "No posts found for this user" });
    }

    res.status(200).json(userPosts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Getting all posts
router.get("/posts", async (req, res) => {
  try {
    const allPosts = await Posts.find();

    res.status(200).json(allPosts);
  } catch (err) {
    res.status(400).json({ err });
  }
});

// Deleting a post
router.delete("/:email/posts/:postId", async (req, res) => {
  try {
    const { email, postId } = req.params;

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ err: `User with the email ${email} does not exist` });
    }

    const post = await Posts.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ err: `Post with the _id ${postId} does not exist` });
    }

    if (post.user !== user.id) {
      return res
        .status(403)
        .json({ err: "You are not authorized to delete this post" });
    }

    await Posts.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = router;
