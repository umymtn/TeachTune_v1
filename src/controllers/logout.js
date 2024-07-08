const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.redirect("/login"); // Redirection after logout
  });
};

module.exports = {
  logout,
};
