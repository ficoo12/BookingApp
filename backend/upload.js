const fs = require("fs");
const path = require("path");
const multer = require("multer");

// UPLOAD_DIR lets a test run or another environment write uploads elsewhere.
const uploadDir = process.env.UPLOAD_DIR || "uploads/";

// multer does not create the destination itself.
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

module.exports = { storage, uploadDir };
