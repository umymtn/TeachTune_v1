const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.NIP) {
    return next();
  } else {
    res.redirect("/login");
    res.status(403).send("Forbidden");
  }
};

module.exports = {
  isAuthenticated,
};
