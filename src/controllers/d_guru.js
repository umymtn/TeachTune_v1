const UserModel = require("../models/guru");

const getAllGuru = async (req, res) => {
  try {
    const [data] = await UserModel.getAllGuru();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const createNewGuru = async (req, res) => {
  const { body } = req;

  try {
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

const updateGuru = (req, res) => {
  const { NIP } = req.params;
  console.log("NIP: ", NIP);
  res.json({
    message: "UPDATE guru success",
    data: req.body,
  });
};

module.exports = {
  getAllGuru,
  updateGuru,
  createNewGuru,
};
