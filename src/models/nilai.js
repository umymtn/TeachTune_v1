const dbPool = require("../config/database");

const getStatistikKemajuan = (SessionNIP) => {
  const SQLQuery = `SELECT n.id_modulajar, rk.id_ruangkelas, g.NIP, ma.Bab, rk.nama_kelas,
                          AVG(n.nilai) AS avg_nilai,
                          AVG(CASE WHEN k.status = 'Hadir' THEN 1 ELSE 0 END) * 100 AS avg_kehadiran_percentage,
                          AVG(k.aktif) * 100 AS avg_aktif_percentage,
                          (AVG(n.nilai) + AVG(CASE WHEN k.status = 'Hadir' THEN 1 ELSE 0 END) * 100 + AVG(k.aktif) * 100) / 3 AS overall_avg
                      FROM nilai AS n
                      JOIN kehadiran AS k ON n.id_jadsis = k.id_jadsis
                      JOIN modul_ajar AS ma ON n.id_modulajar = ma.id_modul_ajar
                      JOIN ajar AS a ON ma.id_ajar = a.id_ajar
                      JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
                      JOIN guru AS g ON a.id_guru = g.NIP
                      WHERE g.NIP = '${SessionNIP}'
                      GROUP BY n.id_modulajar, rk.id_ruangkelas, g.NIP, ma.Bab, rk.nama_kelas`;
  return dbPool.execute(SQLQuery);
};

const getNilaibyModul = (SessionNIP, Id_rk) => {
  const SQLQuery = `  SELECT n.id_modulajar, rk.id_ruangkelas, ma.Bab, rk.nama_kelas,
                        AVG(n.nilai) AS avg_nilai
                        FROM nilai AS n
                        JOIN modul_ajar AS ma ON n.id_modulajar = ma.id_modul_ajar
                        JOIN ajar AS a ON ma.id_ajar = a.id_ajar
                        JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
                        JOIN guru AS g ON a.id_guru = g.NIP
                        WHERE g.NIP = '${SessionNIP}' AND rk.id_ruangkelas = '${Id_rk}'
                        GROUP BY n.id_modulajar, rk.id_ruangkelas, ma.Bab, rk.nama_kelas;`;
  return dbPool.execute(SQLQuery);
};

const getAttendanceAndActivityByDate = (SessionNIP, Id_rk) => {
  const SQLQuery = `
    SELECT 
      k.tanggal,
      COUNT(CASE WHEN k.aktif = 1 THEN 1 END) AS active_count,
      COUNT(CASE WHEN k.aktif = 0 THEN 1 END) AS inactive_count,
      COUNT(CASE WHEN k.status = 'Hadir' THEN 1 END) AS present_count,
      COUNT(CASE WHEN k.status IN ('Sakit', 'Izin', 'Alpha') THEN 1 END) AS absent_count
    FROM kehadiran AS k
    JOIN jadwal_siswa AS js ON k.id_jadsis = js.id_jadsis
    JOIN modul_ajar AS ma ON k.id_modulajar = ma.id_modul_ajar
    JOIN ajar AS a ON ma.id_ajar = a.id_ajar
    JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
    JOIN guru AS g ON a.id_guru = g.NIP
    WHERE g.NIP = '${SessionNIP}'  AND rk.id_ruangkelas = '${Id_rk}'
    GROUP BY k.tanggal
    ORDER BY k.tanggal ASC;
  `;
  return dbPool.execute(SQLQuery);
};

module.exports = {
  getStatistikKemajuan,
  getNilaibyModul,
  getAttendanceAndActivityByDate,
};
