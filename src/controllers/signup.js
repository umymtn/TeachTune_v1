const UserModel = require("../models/guru");
const argon2 = require("argon2");

const createNewGuru = async (req, res) => {
  const { body } = req;

  try {
    body.Password = await argon2.hash(body.Password);
    await UserModel.createNewGuru(body);
    res.json({
      message: "CREATE new guru success",
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

module.exports = {
  createNewGuru,
};
