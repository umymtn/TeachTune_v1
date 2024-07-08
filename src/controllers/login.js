const { getGuruByUsername } = require("../models/guru");
const argon2 = require("argon2");

// Fungsi untuk mencocokkan username guru ketika login
const loginGuru = async (Username, Password) => {
  try {
    const [results] = await getGuruByUsername(Username);
    if (results.length === 0) {
      return { success: false, message: "Username atau Password yang dimasukkan tidak valid" };
    }

    const guru = results[0];
    const hashedPassword = await argon2.verify(guru.Password, Password);

    if (hashedPassword) {
      return { success: true, message: "Login berhasil", guru };
    } else {
      return { success: false, message: "Username atau Password yang dimasukkan tidak valid" };
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Internal server error");
  }
};

module.exports = {
  loginGuru,
};
