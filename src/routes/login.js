const express = require("express");
const router = express.Router();

const { loginGuru } = require("../controllers/login");
const { logout } = require("../controllers/logout");

// Route untuk login
router.post("/login", async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const result = await loginGuru(Username, Password);
    if (result.success) {
      const guru = result.guru;
      req.session.NIP = guru.NIP;
      req.session.Username = guru.Username;
      req.session.Jabatan = guru.Jabatan;

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Error saving session" });
        }
        return res.json({
          message: "Login Sukses",
          redirectUrl: `/${guru.Jabatan.toLowerCase().replace(/\s+/g, "_")}`, // Assuming lowercase routes like '/guru', '/kepsek', '/waka_akademik'
          Jabatan: guru.Jabatan,
        });
      });
    } else {
      res.status(401).json({ message: result.message });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal server error");
  }
});

// Route untuk logout
router.post("/logout", logout);
router.get("/logout", logout);

module.exports = router;
