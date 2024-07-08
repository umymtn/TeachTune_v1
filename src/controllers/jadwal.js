const { getAllJadwal } = require("../models/jadwal");

const getJadwal = async (req, res) => {
  try {
    const SessionNIP = req.session.NIP;
    const [data] = await getAllJadwal(SessionNIP);
    res.json(data);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getJadwal,
};
