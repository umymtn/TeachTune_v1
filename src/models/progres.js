const dbPool = require("../config/database");

const getProgres = (nip) => {
  const SQLQuery = `
      SELECT a.id_ruangkelas, rk.nama_kelas,
       (SUM(p.jp_topik) / 
        (SELECT SUM(ma.JP) 
         FROM modul_ajar ma
         WHERE ma.status = 'Divalidasi'
           AND ma.id_ajar = a.id_ajar)) * 100 AS progress_percentage
FROM progres AS p
JOIN modul_ajar AS ma ON p.id_modul_ajar = ma.id_modul_ajar
JOIN ajar AS a ON ma.id_ajar = a.id_ajar
 JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
JOIN guru AS g ON a.id_guru = g.NIP
WHERE g.NIP = ?
GROUP BY a.id_ruangkelas;
    `;
  return dbPool.execute(SQLQuery, [nip]);
};

const getDistinctTingkat = () => {
  const SQLQuery = `SELECT DISTINCT tingkat FROM ruang_kelas`;
  return dbPool.execute(SQLQuery);
};

const getAllProgress = () => {
  const SQLQuery = `
    SELECT a.id_ruangkelas, rk.nama_kelas, a.id_mapel, rk.tingkat, a.id_ajar,
           (SUM(p.jp_topik) / 
            (SELECT SUM(ma.JP) 
             FROM modul_ajar ma
             WHERE ma.status = 'Divalidasi'
               AND ma.id_ajar = a.id_ajar)) * 100 AS progress_percentage
    FROM progres AS p
    JOIN modul_ajar AS ma ON p.id_modul_ajar = ma.id_modul_ajar
    JOIN ajar AS a ON ma.id_ajar = a.id_ajar
    JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
    GROUP BY a.id_ruangkelas, a.id_mapel, rk.tingkat, a.id_ajar, rk.nama_kelas;
  `;
  return dbPool.execute(SQLQuery);
};

const generateIdProgres = async (ajarId, classDropdownText) => {
  try {
    // Ambil tahun ajar aktif
    const SQLQuery = `
      SELECT SUBSTRING(tahun_ajar, 3, 2) AS tahun
      FROM tahun_ajar
      WHERE status = 'Aktif'
      LIMIT 1
    `;
    const [tahunResult] = await dbPool.execute(SQLQuery);
    const tahun = tahunResult[0].tahun;

    // Ambil id_mapel
    const SQLMapelQuery = `
      SELECT id_mapel
      FROM ajar
      WHERE id_ajar = ?
    `;
    const [mapelResult] = await dbPool.execute(SQLMapelQuery, [ajarId]);
    const id_mapel = mapelResult[0].id_mapel;

    // Generate id_progres berdasarkan hasil di atas
    const SQLProgresQuery = `
      SELECT id_progres
      FROM progres
      ORDER BY id_progres DESC
      LIMIT 1
    `;
    const [progresResult] = await dbPool.execute(SQLProgresQuery);
    let lastIdProgres = "PROG";

    if (progresResult.length > 0) {
      const lastId = progresResult[0].id_progres;
      const splitLastId = lastId.split("-");
      const lastAutoIncrement = parseInt(splitLastId[4], 10);
      const nextAutoIncrement = lastAutoIncrement + 1;
      lastIdProgres += `${tahun}-${id_mapel}-${classDropdownText}-${nextAutoIncrement}`;
    } else {
      lastIdProgres += `${tahun}-${id_mapel}-${classDropdownText}-1`;
    }

    return lastIdProgres;
  } catch (error) {
    console.error("Error generating id_progres:", error);
    throw error;
  }
};

const createOrUpdateProgres = async ({ id_progres, id_modul_ajar, topik, tanggal, JP, classDropdownText }) => {
  try {
    let SQLQuery;

    // Ensure classDropdownText is properly passed
    if (!classDropdownText) {
      throw new Error("classDropdownText is not defined");
    }

    const classDropdownTextParts = classDropdownText.split("-");
    const tingkat = classDropdownTextParts[1]; // Adjust based on actual format of classDropdownText

    // Logic to create a new progres or update an existing one
    if (id_progres) {
      SQLQuery = `
        UPDATE progres
        SET id_modul_ajar = ?, topik = ?, jp_topik = ?, tanggal = ?
        WHERE id_progres = ?;
      `;
      await dbPool.execute(SQLQuery, [id_modul_ajar, topik, JP, tanggal, id_progres]);
    } else {
      // Generate the new id_progres using classDropdownText and other variables
      const currentYear = new Date().getFullYear().toString().substring(-2);
      const newIdProgres = `PROG-${currentYear}-${id_modul_ajar.split("-")[2]}-${classDropdownTextParts.join("-")}-XXXX`; // Generate appropriate ID

      SQLQuery = `
        INSERT INTO progres (id_progres, id_modul_ajar, topik, jp_topik, tanggal)
        VALUES (?, ?, ?, ?, ?);
      `;
      await dbPool.execute(SQLQuery, [newIdProgres, id_modul_ajar, topik, JP, tanggal]);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

module.exports = {
  getProgres,
  createOrUpdateProgres,
  getDistinctTingkat,
  getAllProgress,
};
