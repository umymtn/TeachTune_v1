const dbPool = require("../config/database");

const getAllGuru = () => {
  const SQLQuery = `SELECT * FROM guru`;
  return dbPool.execute(SQLQuery);
};

const getGuruByUsername = (Username) => {
  const SQLQuery = `SELECT * FROM guru WHERE Username ='${Username}'`;
  return dbPool.execute(SQLQuery);
};

const getGuruByNIP = (NIP) => {
  const SQLQuery = `SELECT * FROM guru WHERE NIP = ?`;
  return dbPool.execute(SQLQuery, [NIP]);
};

const getTotalGuru = () => {
  const SQLQuery = `SELECT 
                    COUNT(*) AS total_active_guru,
                    COUNT(CASE WHEN Jenis_Kelamin = 'Laki-laki' THEN 1 END) AS total_active_putra,
                    COUNT(CASE WHEN Jenis_Kelamin = 'Perempuan' THEN 1 END) AS total_active_putri
                    FROM guru
                    WHERE aktif = 1;`;
  return dbPool.execute(SQLQuery);
};

const createNewGuru = async (body) => {
  const SQLQuery = `  INSERT INTO guru (NIP, Nama_Lengkap, Pangkat_Gol, Jabatan, Mulai_Kerja, Di_Sini_Sejak, NRG, NUPTK, Status_Kepegawaian, Tempat_Lahir, Tanggal_Lahir, Agama, Jenis_Kelamin, 
                      Warga_Negara, NPWP, No_Telp, Email, Alamat, Pendidikan, Tahun_Ijazah, Username, Password, id_mapel) 
                      VALUES ('${body.NIP}', '${body.Nama_Lengkap}', '${body.Pangkat_Gol}', '${body.Jabatan}', '${body.Mulai_Kerja}', '${body.Di_Sini_Sejak}', '${body.NRG}', '${body.NUPTK}', 
                      '${body.Status_Kepegawaian}', '${body.Tempat_Lahir}', '${body.Tanggal_Lahir}', '${body.Agama}', '${body.Jenis_Kelamin}', '${body.Warga_Negara}','${body.NPWP}', 
                      '${body.No_Telp}', '${body.Email}', '${body.Alamat}', '${body.Pendidikan}', '${body.Tahun_Ijazah}', '${body.Username}', '${body.Password}', '${body.id_mapel}')`;

  return dbPool.execute(SQLQuery);
};

const updateGuru = async (Username, hashedPassword) => {
  // const SQLQuery = `UPDATE guru
  //                   SET NIP='${body.NIP}', Nama_Lengkap='${body.Nama_Lengkap}', Pangkat_Gol='${body.Pangkat_Gol}', Jabatan='${body.Jabatan}', Mulai_Kerja='${body.Mulai_Kerja}', Di_Sini_Sejak='${body.Di_Sini_Sejak}', NRG='${body.NRG}', NUPTK='${body.NUPTK}', Status_Kepegawaian='${body.Status_Kepegawaian}', Tempat_Lahir='${body.Tempat_Lahir}', Tanggal_Lahir='${body.Tanggal_Lahir}', Agama='${body.Agama}', Jenis_Kelamin='${body.Jenis_Kelamin}', Warga_Negara='${body.Warga_Negara}', NPWP='${body.NPWP}', No_Telp='${body.No_Telp}', Email='${body.Email}', Alamat='${body.Alamat}', Pendidikan='${body.Pendidikan}',	Tahun_Ijazah='${body.Tahun_Ijazah}', Username='${body.Username}', Password='${hashedPassword}', id_mapel='${body.id_mapel}'
  //                   WHERE username=${Username}`;
  const SQLQuery = `UPDATE guru 
                    SET Password='${hashedPassword}'
                    WHERE Username='${Username}'`;
  console.log(`Running query: ${SQLQuery}`);
  return dbPool
    .execute(SQLQuery)
    .then((result) => {
      console.log("Update result:", result);
      return result;
    })
    .catch((error) => {
      console.error("Error executing query:", error);
      throw error;
    });
};

module.exports = {
  getAllGuru,
  getGuruByUsername,
  getGuruByNIP,
  getTotalGuru,
  createNewGuru,
  updateGuru,
};
