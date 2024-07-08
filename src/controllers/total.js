const { getTotalSiswa } = require("../models/siswa");
const { getTotalGuru } = require("../models/guru");
const { getTotalValidated, getTotalNotValidated } = require("../models/modul_ajar");

const getAllSiswa = async (req, res) => {
  try {
    const [data] = await getTotalSiswa();

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getAllGuru = async (req, res) => {
  try {
    const [data] = await getTotalGuru();

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getAllValidates = async (req, res) => {
  try {
    const [data] = await getTotalValidated();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getAllNotValidates = async (req, res) => {
  try {
    const [data] = await getTotalNotValidated();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

module.exports = {
  getAllSiswa,
  getAllGuru,
  getAllValidates,
  getAllNotValidates,
};
