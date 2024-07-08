const { createModulAjar } = require("../models/modul_ajar");

const addModulAjar = async (req, res, next) => {
  try {
    await createModulAjar(req, res);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Gagal menambahkan modul ajar", error: error.message });
  }
};
module.exports = {
  addModulAjar,
};
