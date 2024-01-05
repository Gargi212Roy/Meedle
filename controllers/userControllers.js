const Users = require("../models/Users");
const HttpException = require("../exception/httpException");

exports.updateName = async (req, res) => {
  try {
    const user = req.user;

    if (!req.body) throw new HttpException(400, "Form data absent!!");

    const { name } = req.body;

    if (!name) throw new HttpException(400, "Name field cannot be empty");

    const updatedUser = await Users.findByIdAndUpdate(user.id, { name });

    return res
      .status(200)
      .json({ success: true, id: updatedUser.id, name: updatedUser.name });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || " Updating Name Failed!!",
    });
  }
};
