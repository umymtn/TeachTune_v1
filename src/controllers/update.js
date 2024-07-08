const argon2 = require("argon2");
const { getGuruByUsername, updateGuru } = require("../models/guru");

const updatePasswordController = async (req, res) => {
  try {
    const { Username, newPassword } = req.body;

    // Log the request body
    console.log("Request body:", req.body);

    // Validate that both Username and newPassword are provided
    if (!Username || !newPassword) {
      return res.status(400).send("Username and new password are required.");
    }

    // Check if user exists
    const [rows] = await getGuruByUsername(Username);
    if (rows.length === 0) {
      return res.status(404).send("User not found");
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update the password in the database
    await updateGuru(Username, hashedPassword);

    res.send("Password updated successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  updatePasswordController,
};
