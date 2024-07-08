const dbPool = require("../config/database");

const getAllJadwal = (SessionNIP) => {
  const SQLQuery = `SELECT 
        j.id_jampel,
        jp.hari,
        jp.mulai,
        jp.selesai,
        m.nama_mapel AS mapel,
        rk.nama_kelas AS kelas
      FROM 
        jadwal j
      JOIN 
        jam_pelajaran jp ON j.id_jampel = jp.id_jampel
      JOIN 
        ajar a ON j.id_ajar = a.id_ajar
      JOIN 
        guru g ON a.id_guru = g.NIP
      JOIN 
        mapel m ON a.id_mapel = m.id_mapel
      JOIN 
        ruang_kelas rk ON a.id_ruangkelas = rk.id_ruangkelas
      WHERE g.NIP = '${SessionNIP}'
      ORDER BY 
        FIELD(jp.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'),
        jp.mulai;`;
  return dbPool.execute(SQLQuery);
};

module.exports = {
  getAllJadwal,
};
