const dbPool = require("../config/database");

const getKelas = (SessionNIP) => {
  const SQLQuery = `
      SELECT rk.*
      FROM ruang_kelas AS rk
      JOIN ajar AS a ON rk.id_ruangkelas = a.id_ruangkelas
      JOIN guru AS g ON a.id_guru = g.NIP
      WHERE g.NIP = '${SessionNIP}'
      GROUP BY rk.id_ruangkelas, rk.nama_kelas;
    `;
  return dbPool.execute(SQLQuery);
};

const getAllIdKelas = () => {
  const SQLQuery = `
      SELECT rk.*
      FROM ruang_kelas AS rk
      JOIN ajar AS a ON rk.id_ruangkelas = a.id_ruangkelas
      JOIN guru AS g ON a.id_guru = g.NIP
      GROUP BY rk.id_ruangkelas, rk.nama_kelas;
    `;
  return dbPool.execute(SQLQuery);
};

module.exports = {
  getKelas,
  getAllIdKelas,
};
