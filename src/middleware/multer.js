const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/file");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date();
    const formatDate = timestamp.toLocaleDateString("id-ID").split("/").join("-");
    const username = req.session.Username;
    const Bab = req.body.Bab;

    const originalname = file.originalname;
    const extension = path.extname(file.originalname);

    let filename = `${formatDate}-${username}_bab${Bab}${extension}`;

    let fileNumber = 1;
    while (fs.existsSync(path.join("public/file", filename))) {
      filename = `${formatDate}-${username}_bab${Bab}(${fileNumber})${extension}`;
      fileNumber++;
    }

    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1000 * 1000, // 1 MB
  },
});

module.exports = upload;
