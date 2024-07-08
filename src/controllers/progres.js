const dbPool = require("../config/database");
const { getNilaibyModul, getAttendanceAndActivityByDate } = require("../models/nilai");
const { getKelas, getAllIdKelas } = require("../models/ruang_kelas");
const { createOrUpdateProgres } = require("../models/progres");
const { getDistinctTingkat, getAllProgress } = require("../models/progres");

const getNilaiStatistik = async (req, res) => {
  try {
    const sessionNIP = req.session.NIP;
    const id_rk = req.params.id_rk; // Use params for GET request

    if (!id_rk) {
      console.error("Error: id_rk is not provided");
      return res.status(400).json({ message: "id_rk is required" });
    }

    const [gradesData] = await getNilaibyModul(sessionNIP, id_rk);
    const [attendanceActivityData] = await getAttendanceAndActivityByDate(sessionNIP, id_rk);

    const [guruData] = await dbPool.execute("SELECT Nama_Lengkap FROM guru WHERE NIP = ?", [sessionNIP]);
    const guruName = guruData[0] ? guruData[0].Nama_Lengkap : "Guru";

    res.json({
      message: "GET all nilai success",
      gradesData: gradesData,
      attendanceActivityData: attendanceActivityData,
      guruName: guruName,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
    console.error("Error: ", error);
    throw error;
  }
};

const getTingkatData = async (req, res) => {
  try {
    const [rows] = await getDistinctTingkat();
    res.status(200).json(rows.map((row) => row.tingkat));
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Failed to fetch tingkat data" });
  }
};

const getAllProgressData = async (req, res) => {
  try {
    const [rows] = await getAllProgress();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Failed to fetch progress data" });
  }
};

const getKelasByNIP = async (req, res) => {
  try {
    const sessionNIP = req.session.NIP;
    const [data] = await getKelas(sessionNIP);
    res.json({ kelas: data });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllKelas = async (req, res) => {
  try {
    const [data] = await getAllIdKelas();
    res.json({ kelas: data });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const addOrUpdateProgres = async (req, res) => {
  try {
    const { id_progres, id_modul_ajar, topik, tanggal, JP, classDropdownText } = req.body;
    console.log("Request Body:", req.body); // Add this line to log the request body

    // Pass the classDropdownText to the model function
    const result = await createOrUpdateProgres({ id_progres, id_modul_ajar, topik, tanggal, JP, classDropdownText });
    res.status(200).json({ message: "Progres berhasil ditambahkan atau diperbarui", result });
  } catch (error) {
    console.error("Error creating or updating progres:", error);
    res.status(500).json({ message: "Gagal menambahkan atau memperbarui progres", error: error.message });
  }
};

module.exports = {
  getNilaiStatistik,
  getKelasByNIP,
  addOrUpdateProgres,
  getAllKelas,
  getTingkatData,
  getAllProgressData,
};
