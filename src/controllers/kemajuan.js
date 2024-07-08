const dbPool = require("../config/database");
const statistikModel = require("../models/nilai");
const { getProgres } = require("../models/progres");

const getStatistikControl = async (req, res) => {
  try {
    const sessionNIP = req.session.NIP;

    const [data] = await statistikModel.getStatistikKemajuan(sessionNIP);
    const [guruData] = await dbPool.execute("SELECT Nama_Lengkap FROM guru WHERE NIP = ?", [sessionNIP]);
    const guruName = guruData[0] ? guruData[0].Nama_Lengkap : "Guru";

    res.json({
      message: "GET all kemajuan success",
      data: data,
      guruName: guruName,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getProgresControl = async (req, res) => {
  try {
    const nip = req.session.NIP;
    const [rows] = await getProgres(nip);
    res.json(rows);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getStatistikControl,
  getProgresControl,
};
