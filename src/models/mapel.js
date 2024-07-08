const dbPool = require("../config/database");

const getIdMapelByNIP = (SessionNIP) => {
  const SQLQuery = `SELECT id_mapel FROM guru WHERE NIP = '${SessionNIP}'`;
  return dbPool.execute(SQLQuery);
};

const getAllIdMapel = () => {
  const SQLQuery = `SELECT * FROM mapel`;
  return dbPool.execute(SQLQuery);
};

module.exports = {
  getIdMapelByNIP,
  getAllIdMapel,
};
