const dbPool = require("../config/database");

const getTotalSiswa = () => {
  const SQLQuery = `SELECT 
                    COUNT(*) AS total_active_siswa,
                    COUNT(CASE WHEN Jenis_Kelamin = 'L' THEN 1 END) AS total_active_putra,
                    COUNT(CASE WHEN Jenis_Kelamin = 'P' THEN 1 END) AS total_active_putri
                    FROM siswa
                    WHERE aktif = 1;
                    `;
  return dbPool.execute(SQLQuery);
};

module.exports = {
  getTotalSiswa,
};
