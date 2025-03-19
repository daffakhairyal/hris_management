const { Attendance, User } = require("../models");
const haversine = require("haversine-distance");
const geoip = require("geoip-lite");

// Koordinat kantor
const OFFICE_LOCATION = { latitude: -6.597440929064721, longitude: 106.80819796714678 };

// Fungsi cek apakah dalam radius kantor
const isWithinRadius = (userLocation, officeLocation, radius = 1000) => {
    const distance = haversine(userLocation, officeLocation);
    return distance <= radius;
};

// Fungsi mendapatkan IP user dengan benar
const getUserIP = (req) => {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    if (ip.includes(",")) ip = ip.split(",")[0]; // Ambil IP pertama jika ada beberapa
    return ip.replace("::ffff:", ""); // Hilangkan format IPv6 yang diawali "::ffff:"
};

// Fungsi deteksi Fake GPS
const detectFakeGPS = (ip, userLocation) => {
    const geo = geoip.lookup(ip);
    if (!geo) return false;

    const ipLocation = { latitude: geo.ll[0], longitude: geo.ll[1] };
    const distance = haversine(ipLocation, userLocation);

    console.log(`🚨 Deteksi Fake GPS:`);
    console.log(`- Lokasi berdasarkan IP:`, ipLocation);
    console.log(`- Lokasi user:`, userLocation);
    console.log(`- Jarak: ${distance / 1000} km`);

    return distance > 20000; // Perbedaan >20 km dianggap Fake GPS
};

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findAll({
            include: [{ model: User, as: "user" }]
        });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
    try {
        const attendance = await Attendance.findByPk(req.params.id, {
            include: [{ model: User, as: "user" }]
        });
        if (!attendance) return res.status(404).json({ message: "Attendance not found" });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAttendanceByUserId = async(req,res)=>{
    try {
        const userId = await Attendance.findAll({
            where: { user_id: req.params.user_id },
            include: [{ model: User, as: "user" }],
            order: [['createdAt', 'DESC']] 
        });
        if(!userId.length) return res.status(404).json({ message: "User not found" });
        res.json(userId)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Check-in
exports.checkIn = async (req, res) => {
    try {
        const { user_id, latitude, longitude } = req.body;
        const checkInPhoto = req.file ? req.file.path : null;
        const userIp = getUserIP(req);

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Lokasi wajib dikirim" });
        }

        const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

        if (!isWithinRadius(userLocation, OFFICE_LOCATION, 1000)) {
            return res.status(400).json({ message: "Anda berada di luar area kantor!" });
        }

        if (detectFakeGPS(userIp, userLocation)) {
            return res.status(400).json({ message: "Fake GPS terdeteksi!" });
        }

        const existingAttendance = await Attendance.findOne({ where: { user_id, check_out: null } });
        if (existingAttendance) {
            return res.status(400).json({ message: "User sudah check-in" });
        }

        const newAttendance = await Attendance.create({
            user_id,
            check_in: new Date(),
            check_in_photo: checkInPhoto,
            check_in_latitude: latitude,
            check_in_longitude: longitude,
            status: 0
        });

        res.status(201).json(newAttendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Check-out
exports.checkOut = async (req, res) => {
    try {
        const { user_id, latitude, longitude } = req.body;
        const checkOutPhoto = req.file ? req.file.path : null;
        const userIp = getUserIP(req);

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Lokasi wajib dikirim" });
        }

        const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

        if (!isWithinRadius(userLocation, OFFICE_LOCATION, 1000)) {
            return res.status(400).json({ message: "Anda berada di luar area kantor!" });
        }

        if (detectFakeGPS(userIp, userLocation)) {
            return res.status(400).json({ message: "Fake GPS terdeteksi!" });
        }

        const attendance = await Attendance.findOne({ where: { user_id, check_out: null } });
        if (!attendance) {
            return res.status(400).json({ message: "User belum check-in" });
        }

        await attendance.update({
            check_out: new Date(),
            check_out_photo: checkOutPhoto,
            check_out_latitude: latitude,
            check_out_longitude: longitude
        });

        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByPk(req.params.id);
        if (!attendance) return res.status(404).json({ message: "Attendance not found" });

        await attendance.destroy();
        res.json({ message: "Attendance record deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
