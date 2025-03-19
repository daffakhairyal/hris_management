const express = require('express');
const router = express.Router();
const multer = require('multer');
const attendanceController = require('../controllers/absensiController');

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Routes
router.get('/attendance', attendanceController.getAllAttendance);
router.get('/attendance/:id', attendanceController.getAttendanceById);
router.get('/attendance/user/:user_id', attendanceController.getAttendanceByUserId);
router.post('/attendance/checkin', upload.single('check_in_photo'), attendanceController.checkIn);
router.post('/attendance/checkout', upload.single('check_out_photo'), attendanceController.checkOut);
router.delete('/attendance/:id', attendanceController.deleteAttendance);

module.exports = router;