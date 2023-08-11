const express = require("express");
const userRoute = require("./routes/UserRoutes");
const postRoute = require("./routes/PostRoutes");
const authRoutes = require("./routes/api/authRoutes");

require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected MongoDb"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/auth", authRoutes);

const PORT = 8080;
app.listen(PORT, () => console.log(`server started on port ${PORT} `));
