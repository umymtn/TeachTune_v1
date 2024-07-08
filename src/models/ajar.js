const dbPool = require("../config/database");

const getAjarId = (id_mapel, NIP, kelas) => {
  const SQLQuery = `SELECT a.id_ajar 
      FROM ajar AS a
      JOIN guru AS g ON a.id_guru = g.NIP
      JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
      WHERE a.id_mapel = '${id_mapel}' AND g.NIP = '${NIP}' AND rk.nama_kelas = '${kelas}'`;
  return dbPool.execute(SQLQuery);
};

const getAjarIdByKelas = (id_mapel, kelas) => {
  const SQLQuery = `SELECT a.id_ajar 
  FROM ajar AS a
  JOIN guru AS g ON a.id_guru = g.NIP
  JOIN ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
  WHERE a.id_mapel = '${id_mapel}' AND rk.nama_kelas = '${kelas}'`;
  return dbPool.execute(SQLQuery);
};

module.exports = {
  getAjarId,
  getAjarIdByKelas,
};
