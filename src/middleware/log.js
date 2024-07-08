const logRequest = (req, rest, next) => {
  console.log("log terjadi request ke API ini");
  next();
};

module.exports = logRequest;
