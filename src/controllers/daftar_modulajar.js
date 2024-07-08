const ModulAjarModel = require("../models/modul_ajar");

const getAll = async (req, res) => {
  try {
    const modulAjar = await ModulAjarModel.getAllModulAjar();

    if (modulAjar && modulAjar.length > 0) {
      modulAjar.forEach((modul) => {
        if (modul.tanggal) {
          modul.tanggal = new Date(modul.tanggal).toLocaleDateString("id-ID");
        }
      });
    }

    res.json(modulAjar[0]);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Gagal menampilkan modul ajar",
      error: error.message,
    });
  }
};

const getModulAjarbyNIP = async (req, res) => {
  try {
    const sessionNIP = req.session.NIP;

    const modulAjar = await ModulAjarModel.getModulbyNIP(sessionNIP);
    if (modulAjar && modulAjar.length > 0) {
      modulAjar.forEach((modul) => {
        if (modul.tanggal) {
          modul.tanggal = new Date(modul.tanggal).toLocaleDateString("id-ID");
        }
      });
    }

    res.json(modulAjar[0]);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Gagal menampilkan modul ajar",
      error: error.message,
    });
  }
};

const getModulWaka = async (req, res) => {
  try {
    const modulAjar = await ModulAjarModel.getModulWaka();

    if (modulAjar && modulAjar.length > 0) {
      modulAjar.forEach((modul) => {
        if (modul.tanggal) {
          modul.tanggal = new Date(modul.tanggal).toLocaleDateString("id-ID");
        }
      });
    }

    res.json(modulAjar);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Gagal menampilkan modul ajar",
      error: error.message,
    });
  }
};

const getModulKepsek = async (req, res) => {
  try {
    const modulAjar = await ModulAjarModel.getModulKepsek();

    if (modulAjar && modulAjar.length > 0) {
      modulAjar.forEach((modul) => {
        if (modul.tanggal) {
          modul.tanggal = new Date(modul.tanggal).toLocaleDateString("id-ID");
        }
      });
    }

    res.json(modulAjar);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Gagal menampilkan modul ajar",
      error: error.message,
    });
  }
};

module.exports = {
  getModulAjarbyNIP,
  getModulWaka,
  getModulKepsek,
  getAll,
};
