const dbPool = require("../config/database");

const getAllMateri = (SessionNIP, Id_mapel, tingkat) => {
  const SQLQuery = `SELECT DISTINCT
      m.*
    FROM 
      materi AS m
    JOIN 
      mapel AS map ON m.id_mapel = map.id_mapel
    JOIN 
      ajar AS a ON a.id_mapel = map.id_mapel
    JOIN 
      guru AS g ON a.id_guru = g.NIP
    JOIN 
      ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
    WHERE 
      g.NIP = '${SessionNIP}' 
      AND map.id_mapel = '${Id_mapel}'
      AND m.tingkat= '${tingkat}'`;
  return dbPool.execute(SQLQuery);
};

const getDaftarMateri = (Id_mapel, tingkat) => {
  const SQLQuery = `SELECT DISTINCT
      m.*
    FROM 
      materi AS m
    JOIN 
      mapel AS map ON m.id_mapel = map.id_mapel
    JOIN 
      ajar AS a ON a.id_mapel = map.id_mapel
    JOIN 
      guru AS g ON a.id_guru = g.NIP
    JOIN 
      ruang_kelas AS rk ON a.id_ruangkelas = rk.id_ruangkelas
    WHERE  
      map.id_mapel = '${Id_mapel}'
      AND m.tingkat= '${tingkat}'`;
  return dbPool.execute(SQLQuery);
};

module.exports = {
  getAllMateri,
  getDaftarMateri,
};
