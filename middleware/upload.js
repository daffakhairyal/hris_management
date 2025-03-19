const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Direktori penyimpanan
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Nama unik
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
