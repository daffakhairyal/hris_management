const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const LoginController = require("../controllers/loginController");

// Route untuk membuat transaksi baru
router.post("/transactions", LoginController.verifyMe, transactionController.createTransaction);

// Route untuk mendapatkan semua transaksi
router.get("/transactions", LoginController.verifyMe, transactionController.getAllTransactions);

// Route untuk mendapatkan transaksi berdasarkan ID
router.get("/transactions/:id", LoginController.verifyMe, transactionController.getTransactionById);

// Route untuk update transaksi
router.patch("/transactions/:id", LoginController.verifyMe, transactionController.updateTransaction);

// Route untuk menghapus transaksi
router.delete("/transactions/:id", LoginController.verifyMe, transactionController.deleteTransaction);

// Route untuk menghapus transaksi
router.delete("/transactions", LoginController.verifyMe, transactionController.bulkDelete);

module.exports = router;