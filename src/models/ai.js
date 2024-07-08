const dbPool = require("../config/database");

async function fetchMySQLData(Bab, judul) {
  const connection = await dbPool.getConnection();
  const queryCurrentYear = `
      SELECT 
        ma.id_modul_ajar,
        ma.metode,
        AVG(n.nilai) AS avg_nilai,
        AVG(CASE WHEN k.status = 'Hadir' THEN 1 ELSE 0 END) * 100 AS avg_kehadiran_percentage,
        AVG(k.aktif) * 100 AS avg_aktif_percentage,
        (AVG(n.nilai) + AVG(CASE WHEN k.status = 'Hadir' THEN 1 ELSE 0 END) * 100 + AVG(k.aktif) * 100) / 3 AS overall_avg
    FROM 
        nilai AS n
    JOIN 
        kehadiran AS k ON n.id_jadsis = k.id_jadsis
    JOIN 
        modul_ajar AS ma ON n.id_modulajar = ma.id_modul_ajar
    WHERE 
        ma.Bab = ? AND ma.judul = ? AND YEAR(n.tanggal) = YEAR(CURDATE())
    GROUP BY 
        ma.id_modul_ajar;
    `;

  console.log("Executing query with Bab and judul:", Bab, judul);
  const [currentYearRows] = await connection.execute(queryCurrentYear, [Bab, judul]);

  console.log("Query Current Year Result:", currentYearRows);

  return { currentYear: currentYearRows };
}

module.exports = {
  fetchMySQLData,
};
