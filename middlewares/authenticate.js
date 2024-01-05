const HttpException = require("../exception/httpException");
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers?.authhorization?.substring(7);

    if (!token) throw new HttpException(400, "user not logged in");

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!verified) throw new HttpException(400, "Invalid token");

    req.user = verified;

    next();
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || " Authentication Failed!!",
    });
  }
};
