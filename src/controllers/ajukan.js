const { getAllMateri, getDaftarMateri } = require("../models/materi");
const { getIdMapelByNIP, getAllIdMapel } = require("../models/mapel");
const { getAjarId, getAjarIdByKelas } = require("../models/ajar");

const getMateri = async (req, res) => {
  try {
    const sessionNIP = req.session.NIP;
    const { Id_mapel, tingkat } = req.query;
    const [data] = await getAllMateri(sessionNIP, Id_mapel, tingkat);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getSemuaMateri = async (req, res) => {
  try {
    const { Id_mapel, tingkat } = req.query;
    const [data] = await getDaftarMateri(Id_mapel, tingkat);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getMapel = async (req, res) => {
  try {
    const sessionNIP = req.session.NIP;
    const [data] = await getIdMapelByNIP(sessionNIP);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getAllMapel = async (req, res) => {
  try {
    const [data] = await getAllIdMapel();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getIdAjar = async (req, res) => {
  try {
    const NIP = req.session.NIP;
    const { id_mapel, kelas } = req.body;

    const [data] = await getAjarId(id_mapel, NIP, kelas);

    if (data.length > 0) {
      res.json({ ajarId: data[0].id_ajar });
    } else {
      res.status(404).json({ error: "Ajar ID not found" });
    }
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getIdAjarByKelas = async (req, res) => {
  try {
    const { id_mapel, kelas } = req.body;

    const [data] = await getAjarIdByKelas(id_mapel, kelas);

    if (data.length > 0) {
      res.json({ ajarId: data[0].id_ajar });
    } else {
      res.status(404).json({ error: "Ajar ID not found" });
    }
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getMateri,
  getMapel,
  getIdAjar,
  getAllMapel,
  getSemuaMateri,
  getIdAjarByKelas,
};
