const { getGuruByNIP } = require("../models/guru");

const getDataGuru = async (req, res) => {
  try {
    const sessionNIP = req.session.NIP;
    const [data] = await getGuruByNIP(sessionNIP);
    if (data.length > 0) {
      res.json(data[0]);
    } else {
      res.status(404).json({ message: "Data guru tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error fetching data guru:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getDataGuru,
};
