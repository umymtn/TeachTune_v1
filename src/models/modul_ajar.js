const dbPool = require("../config/database");
const upload = require("../middleware/multer");

const getAllModulAjar = () => {
  const SQLQuery = `SELECT ma.id_modul_ajar, ma.status, a.id_mapel, rk.nama_kelas, ma.Bab, 
                        ma.judul, DATE_FORMAT(ma.tanggal, '%d/%m/%y') AS formatted_date, 
                        ma.JP, ma.metode, ma.url_file
                        FROM modul_ajar AS ma 
                        JOIN ajar AS a ON ma.id_ajar = a.id_ajar
                        JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
                        JOIN guru AS g ON a.id_guru = g.NIP`;
  return dbPool.execute(SQLQuery);
};

const getModulbyNIP = async (sessionNIP) => {
  try {
    const SQLQuery = `  SELECT ma.id_modul_ajar, ma.status, a.id_mapel, rk.nama_kelas, ma.Bab, 
                        ma.judul, DATE_FORMAT(ma.tanggal, '%d/%m/%y') AS formatted_date, 
                        ma.JP, ma.metode, ma.url_file
                        FROM modul_ajar AS ma 
                        JOIN ajar AS a ON ma.id_ajar = a.id_ajar
                        JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
                        JOIN guru AS g ON a.id_guru = g.NIP
                        WHERE g.NIP='${sessionNIP}'
                        ORDER BY FIELD(ma.status, "Diajukan", "Diverifikasi", "Divalidasi", "Ditolak")`;
    return dbPool.execute(SQLQuery);
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const getModulWaka = async () => {
  try {
    const SQLQuery = `  SELECT ma.id_modul_ajar, ma.status, a.id_mapel, rk.nama_kelas, ma.Bab, 
                        ma.judul, DATE_FORMAT(ma.tanggal, '%d/%m/%y') AS formatted_date, 
                        ma.JP, ma.metode, ma.url_file
                            FROM modul_ajar AS ma
                            JOIN ajar AS a ON ma.id_ajar = a.id_ajar
                            JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
                            WHERE ma.status IN ('Diajukan','Diverifikasi', 'Divalidasi')
                            ORDER BY FIELD(ma.status, "Diajukan", "Diverifikasi", "Divalidasi", "Ditolak");`;

    const [data] = await dbPool.execute(SQLQuery);
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const getModulKepsek = async () => {
  try {
    const SQLQuery = `  SELECT ma.id_modul_ajar, ma.status, a.id_mapel, rk.nama_kelas, ma.Bab, 
                        ma.judul, DATE_FORMAT(ma.tanggal, '%d/%m/%y') AS formatted_date, 
                        ma.JP, ma.metode, ma.url_file
                            FROM modul_ajar AS ma
                            JOIN ajar AS a ON ma.id_ajar = a.id_ajar
                            JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
                            WHERE ma.status IN ('Diverifikasi', 'Divalidasi');`;
    const [data] = await dbPool.execute(SQLQuery);
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const getTotalValidated = async () => {
  try {
    const SQLQuery = `  SELECT COUNT(*) AS total_modul
FROM modul_ajar 
WHERE status = 'Divalidasi';
`;
    const [data] = await dbPool.execute(SQLQuery);
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const getTotalNotValidated = async () => {
  try {
    const SQLQuery = `  SELECT COUNT(*) AS total_modul
FROM modul_ajar 
WHERE status = 'Diverifikasi';
`;
    const [data] = await dbPool.execute(SQLQuery);
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const generateIdModulAjar = async (ajarId) => {
  try {
    const SQLQuery = `
      SELECT g.NIP AS guruNIP, a.id_mapel AS ajarIdMapel, rk.tingkat AS ruangKelasTingkat
      FROM ajar AS a
      JOIN guru AS g ON a.id_guru = g.NIP
      JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
      WHERE a.id_ajar = ?
    `;
    const [rows] = await dbPool.execute(SQLQuery, [ajarId]);

    if (rows.length > 0) {
      const { guruNIP, ajarIdMapel, ruangKelasTingkat } = rows[0];
      const id_modul_ajar = await generateIdModulAjarString(guruNIP, ajarIdMapel, ruangKelasTingkat);
      return id_modul_ajar;
    } else {
      throw new Error("Data tidak ditemukan");
    }
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const generateIdModulAjarString = async (guruNIP, ajarIdMapel, ruangKelasTingkat) => {
  try {
    const SQLQuery = `SELECT id_modul_ajar FROM modul_ajar ORDER BY id_modul_ajar DESC LIMIT 1`;
    const [rows] = await dbPool.execute(SQLQuery);

    let lastIdModulAjar = "MA-";
    let nextAutoIncrement = 1;

    if (rows.length > 0) {
      const lastId = rows[0].id_modul_ajar;
      const splitLastId = lastId.split("-");
      const lastAutoIncrement = parseInt(splitLastId[4], 10);
      nextAutoIncrement = lastAutoIncrement + 1;
    }

    lastIdModulAjar += `${guruNIP}-${ajarIdMapel}-${ruangKelasTingkat}-${nextAutoIncrement}`;

    console.log(`Generated id_modul_ajar: ${lastIdModulAjar}`);

    return lastIdModulAjar;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const createModulAjar = async (req, res) => {
  try {
    const { ajarId, Bab, judul, tanggal, JP, metode } = req.body;
    console.log(req.body);
    if (!req.file) {
      throw new Error("File is required");
    }

    const id_modul_ajar = await generateIdModulAjar(ajarId);
    const uploadedFile = req.file.filename;
    const url_file = `file/${uploadedFile}`;

    const SQLQuery = `
      INSERT INTO modul_ajar (id_modul_ajar, id_ajar, Bab, judul, tanggal, status, JP, metode, url_file)
      VALUES (?, ?, ?, ?, ?, 'Diajukan', ?, ?, ?)
    `;

    const [result] = await dbPool.execute(SQLQuery, [id_modul_ajar, ajarId, Bab, judul, tanggal, JP, metode, url_file]);

    res.status(201).json({ message: "Modul ajar berhasil ditambahkan", result });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Gagal menambahkan modul ajar", error: error.message });
  }
};

// const generateIdModulAjar = async (ajarId) => {
//   try {
//     const SQLQuery = `
//       SELECT g.NIP AS guruNIP, a.id_mapel AS ajarIdMapel, rk.tingkat AS ruangKelasTingkat
//       FROM ajar AS a
//       JOIN guru AS g ON a.id_guru = g.NIP
//       JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
//       WHERE a.id_ajar = ?
//     `;
//     const [rows] = await dbPool.execute(SQLQuery, [ajarId]);

//     if (rows.length > 0) {
//       const { guruNIP, ajarIdMapel, ruangKelasTingkat } = rows[0];
//       const id_modul_ajar = await generateIdModulAjarString(guruNIP, ajarIdMapel, ruangKelasTingkat);
//       return id_modul_ajar;
//     } else {
//       throw new Error("Data tidak ditemukan");
//     }
//   } catch (error) {
//     console.error("Error: ", error);
//     throw error;
//   }
// };

// const generateIdModulAjarString = async (guruNIP, ajarIdMapel, ruangKelasTingkat) => {
//   try {
//     const SQLQuery = `SELECT id_modul_ajar FROM modul_ajar ORDER BY id_modul_ajar DESC LIMIT 1`;
//     const [rows] = await dbPool.execute(SQLQuery);

//     let lastIdModulAjar = "MA-";

//     if (rows.length > 0) {
//       const lastId = rows[0].id_modul_ajar;
//       const splitLastId = lastId.split("-");
//       const lastAutoIncrement = parseInt(splitLastId[4], 10);
//       const nextAutoIncrement = lastAutoIncrement + 1;
//       lastIdModulAjar += `${guruNIP}-${ajarIdMapel}-${ruangKelasTingkat}-${nextAutoIncrement}`;
//     } else {
//       lastIdModulAjar += `${guruNIP}-${ajarIdMapel}-${ruangKelasTingkat}-1`;
//     }

//     return lastIdModulAjar;
//   } catch (error) {
//     console.error("Error: ", error);
//     throw error;
//   }
// };

// const createModulAjar = async (req, res) => {
//   try {
//     const { ajarId, Bab, judul, tanggal, JP, metode } = req.body;
//     console.log(req.body);
//     if (!req.file) {
//       throw new Error("File is required");
//     }

//     const id_modul_ajar = await generateIdModulAjar(ajarId);
//     const uploadedFile = req.file.filename;
//     const url_file = `file/${uploadedFile}`;

//     const SQLQuery = `
//       INSERT INTO modul_ajar (id_modul_ajar, id_ajar, Bab, judul, tanggal, status, JP, metode, url_file)
//       VALUES (?, ?, ?, ?, ?, 'Diajukan', ?, ?, ?)
//     `;

//     const [result] = await dbPool.execute(SQLQuery, [id_modul_ajar, ajarId, Bab, judul, tanggal, JP, metode, url_file]);

//     res.status(201).json({ message: "Modul ajar berhasil ditambahkan", result });
//   } catch (error) {
//     console.error("Error: ", error);
//     res.status(500).json({ message: "Gagal menambahkan modul ajar", error: error.message });
//   }
// };

const getModulAjarById = async (id_modul_ajar) => {
  try {
    const SQLQuery = `
      SELECT ma.*, a.id_mapel, rk.nama_kelas,
             DATE_FORMAT(ma.tanggal, '%d/%m/%y') AS formatted_date
      FROM modul_ajar AS ma
      JOIN ajar AS a ON ma.id_ajar = a.id_ajar
      JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
      WHERE ma.id_modul_ajar = ?
    `;
    return dbPool.execute(SQLQuery, [id_modul_ajar]);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const updateModulAjar = async (id_modul_ajar, { ajarId, Bab, judul, tanggal, status, JP, metode, url_file }) => {
  try {
    console.log("Updating modul ajar with data:", {
      id_modul_ajar,
      ajarId,
      Bab,
      judul,
      tanggal,
      status,
      JP,
      metode,
      url_file,
    });

    let SQLQuery = `
      UPDATE modul_ajar
      SET id_ajar = ?, Bab = ?, judul = ?, tanggal = ?, status= ?, JP = ?, metode = ?
    `;

    const params = [ajarId || null, Bab || null, judul || null, tanggal || null, status || null, JP || null, metode || null];

    if (url_file) {
      SQLQuery += `, url_file = ?`;
      params.push(url_file);
    }

    SQLQuery += ` WHERE id_modul_ajar = ?`;
    params.push(id_modul_ajar);

    console.log("Executing SQLQuery:", SQLQuery, "with params:", params);

    return dbPool.execute(SQLQuery, params);
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const deleteModulAjar = async (id_modul_ajar) => {
  try {
    const SQLQuery = `DELETE FROM modul_ajar WHERE id_modul_ajar = ?`;
    return dbPool.execute(SQLQuery, [id_modul_ajar]);
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

module.exports = {
  getAllModulAjar,
  getModulbyNIP,
  getModulWaka,
  getModulKepsek,
  createModulAjar,
  getModulAjarById,
  updateModulAjar,
  deleteModulAjar,
  getTotalValidated,
  getTotalNotValidated,
};
