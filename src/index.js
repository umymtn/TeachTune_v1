require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const path = require("path");
const bodyParser = require("body-parser"); //buat menguraikan permintaan JSON
const database = require("./config/database.js");

// const options = {
//   host: process.env.MYSQL_HOST || "localhost",
//   port: process.env.MYSQL_PORT || 3306,
//   user: process.env.MYSQL_USER || "root",
//   password: process.env.MYSQL_PASSWORD || "",
//   database: process.env.MYSQL_DATABASE || "session_test",
// };

const sessionStore = new MySQLStore({}, database);

const signupRoutes = require("./routes/signup.js");
const loginRoutes = require("./routes/login.js");
const guruRoutes = require("./routes/guru.js");
const kepsekRoutes = require("./routes/kepsek.js");
const wakaRoutes = require("./routes/waka.js");
const modulAjarRoutes = require("./routes/daftar_modulajar.js");
const addModulRoutes = require("./routes/add_modulajar.js");
const kemajuanRoutes = require("./routes/kemajuan.js");
const updateRoutes = require("./routes/update.js");
const dataGuruRoutes = require("./routes/data_guru");
const progresRoutes = require("./routes/progres.js");
const jadwalRoutes = require("./routes/jadwal.js");
const aiRoutes = require("./routes/ai");
const sessionRoutes = require("./routes/session");
const keprogresRoutes = require("./routes/kep_utama.js");
const materiRoutes = require("./routes/ajukan.js");
const modul_AjarRoutes = require("./routes/modul_ajar");
const dataAllGuruRoutes = require("./routes/d_guru.js");

const middlewareLogRequest = require("./middleware/log.js");
const { isAuthenticated } = require("./middleware/auth.js");
const upload = require("./middleware/multer.js");

const app = express();

app.use(middlewareLogRequest);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    store: sessionStore,
    secret: "simpansini",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(bodyParser.json());

// Rute yang tidak memerlukan autentikasi
app.use("/api/signup", signupRoutes);
app.use("/api", loginRoutes);
app.use("/api", updateRoutes);

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

// Middleware untuk rute yang memerlukan autentikasi
app.use(isAuthenticated);

// Protected routes
app.use("/guru", guruRoutes);
app.use("/kepsek", kepsekRoutes);
app.use("/waka_akademik", wakaRoutes);
app.use("/api", modulAjarRoutes);
app.use("/api", addModulRoutes);
app.use("/api/kemajuan", kemajuanRoutes);
app.use("/api", dataGuruRoutes);
app.use("/api", progresRoutes);
app.use("/api", jadwalRoutes);
app.use("/api", aiRoutes);
app.use(sessionRoutes);
app.use("/api", keprogresRoutes);
app.use("/api", materiRoutes);
app.use("/api", modul_AjarRoutes);
app.use("/api", dataAllGuruRoutes);

// app.post("/modulajar", upload.single("file"), (req, res) => {
//   res.json({
//     message: "Upload berhasil",
//   });
// });

app.get("/datapegawaiguru", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/datapegawaiguru.html"));
});

app.get("/guru_progres", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/d_guru_proggress.html"));
});

app.get("/jadwal", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/d_guru_jadwal.html"));
});

app.get("/rekomendasi", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/d_guru_modulajar.html"));
});

app.get("/kepsek_progres", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/d_keprogres.html"));
});

app.get("/pengajuanmodulajar", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/d_guru_pengajuan.html"));
});

app.get("/dataallpegawai", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/datapegawai.html"));
});

app.get("/validasimodul", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/d_kepsek_validasi.html"));
});

app.get("/verifikasimodul", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/m_verif.html"));
});

app.get("/allmodul", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/d_kepsek_pengajuan.html"));
});

// app.get("/pengajuanpresensi", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/d_guru_presensi.html"));
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berhasil di running di port ${PORT}`);
});
