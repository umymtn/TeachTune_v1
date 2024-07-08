const { updateModulAjar, deleteModulAjar, getModulAjarById } = require("../models/modul_ajar");

const updateModulAjarControl = async (req, res) => {
  try {
    const { id_modul_ajar, ajarId, Bab, judul, tanggal, status, JP, metode } = req.body;
    const url_file = req.file ? `/file/${req.file.filename}` : req.body.existing_file;

    if (!ajarId) {
      throw new Error("ajarId is required");
    }

    await updateModulAjar(id_modul_ajar, { ajarId, Bab, judul, tanggal, status, JP, metode, url_file });

    res.json({ message: "Modul ajar berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating modul ajar:", error);
    res.status(500).json({ error: "Gagal memperbarui modul ajar" });
  }
};

const deleteModulAjarHandler = async (req, res) => {
  try {
    const { id_modul_ajar } = req.params;
    const result = await deleteModulAjar(id_modul_ajar);
    res.status(200).json({ message: "Modul ajar berhasil dihapus", result });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Gagal menghapus modul ajar", error: error.message });
  }
};

const getModulAjarHandler = async (req, res) => {
  try {
    const { id_modul_ajar } = req.params;
    console.log("Fetching modul ajar with ID:", id_modul_ajar);
    const [result] = await getModulAjarById(id_modul_ajar);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: "Modul ajar tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Gagal mengambil modul ajar", error: error.message });
  }
};

module.exports = {
  updateModulAjarControl,
  deleteModulAjarHandler,
  getModulAjarHandler,
};
