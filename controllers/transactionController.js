const { Transaction, TransactionDetail, User } = require("../models");

module.exports = {
    // Menambahkan transaksi baru
    createTransaction: async (req, res) => {
        try {
            const { user_id, description, transaction_date, details } = req.body;
            
            // Pastikan user ada
            const user = await User.findByPk(user_id);
            if (!user) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }

            // Buat transaksi
            const transaction = await Transaction.create({
                user_id,
                description,
                transaction_date
            });

            // Jika ada detail transaksi, simpan
            if (details && details.length > 0) {
                const transactionDetails = details.map(detail => ({
                    transaction_id: transaction.id,
                    account_id: detail.account_id,
                    debit: detail.debit || 0,
                    credit: detail.credit || 0
                }));
                await TransactionDetail.bulkCreate(transactionDetails);
            }

            res.status(201).json({ message: "Transaksi berhasil dibuat", transaction });
        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
        }
    },

    // Mendapatkan semua transaksi
    getAllTransactions: async (req, res) => {
        try {
            const transactions = await Transaction.findAll({
                include: [
                    { model: User, attributes: ["id", "name", "email"] },
                    { model: TransactionDetail }
                ]
            });
            res.json({ success: true, data: transactions });
        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
        }
    },

    // Mendapatkan transaksi berdasarkan ID
    getTransactionById: async (req, res) => {
        try {
            const { id } = req.params;
            const transaction = await Transaction.findByPk(id, {
                include: [
                    { model: User, attributes: ["id", "name", "email"] },
                    { model: TransactionDetail }
                ]
            });
            
            if (!transaction) {
                return res.status(404).json({ message: "Transaksi tidak ditemukan" });
            }

            res.status(200).json(transaction);
        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
        }
    },

        // Memperbarui transaksi
        updateTransaction: async (req, res) => {
            try {
                const { id } = req.params;
                const { user_id, description, transaction_date, details } = req.body;
    
                // Pastikan transaksi ada
                const transaction = await Transaction.findByPk(id);
                if (!transaction) {
                    return res.status(404).json({ message: "Transaksi tidak ditemukan" });
                }
    
                // Perbarui transaksi
                await transaction.update({ user_id, description, transaction_date });
    
                // Jika ada detail transaksi, hapus detail lama dan buat yang baru
                if (details && details.length > 0) {
                    await TransactionDetail.destroy({ where: { transaction_id: id } });
                    const transactionDetails = details.map(detail => ({
                        transaction_id: id,
                        account_id: detail.account_id,
                        debit: detail.debit || 0,
                        credit: detail.credit || 0
                    }));
                    await TransactionDetail.bulkCreate(transactionDetails);
                }
    
                res.status(200).json({ message: "Transaksi berhasil diperbarui", transaction });
            } catch (error) {
                res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
            }
        },
    

    // Menghapus transaksi
    deleteTransaction: async (req, res) => {
        try {
            const { id } = req.params;
            const transaction = await Transaction.findByPk(id);
            
            if (!transaction) {
                return res.status(404).json({ message: "Transaksi tidak ditemukan" });
            }

            await transaction.destroy();
            res.status(200).json({ message: "Transaksi berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
        }
    },
    bulkDelete: async (req, res) => {
        try {
            const transactions = await Transaction.findAll();
    
            if (transactions.length === 0) {
                return res.status(404).json({ message: "Tidak ada transaksi untuk dihapus" });
            }
    
            await Transaction.destroy({ where: {}});
    
            return res.status(200).json({ success: true, message: "Semua transaksi berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }    
};
