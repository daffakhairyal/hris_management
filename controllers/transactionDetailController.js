const { TransactionDetail, Transaction, Account } = require("../models");

// **Get All Transaction Details**
exports.getAllTransactionDetails = async (req, res) => {
    try {
        const transactionDetails = await TransactionDetail.findAll({
            include: [
                { model: Transaction, as: "transaction" },
                { model: Account, as: "account" }
            ]
        });
        res.json({ success: true, data: transactionDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **Get Transaction Detail by ID**
exports.getTransactionDetailById = async (req, res) => {
    try {
        const { id } = req.params;
        const transactionDetail = await TransactionDetail.findByPk(id, {
            include: [
                { model: Transaction, as: "transaction" },
                { model: Account, as: "account" }
            ]
        });

        if (!transactionDetail) {
            return res.status(404).json({ message: "Transaction Detail not found" });
        }

        res.status(200).json(transactionDetail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **Create a New Transaction Detail**
exports.createTransactionDetail = async (req, res) => {
    try {
        const { transaction_id, account_id, debit, credit } = req.body;

        // Ensure at least one field (debit or credit) has a value greater than 0
        if (debit <= 0 && credit <= 0) {
            return res.status(400).json({ message: "Either debit or credit must be greater than zero" });
        }

        const newTransactionDetail = await TransactionDetail.create({
            transaction_id,
            account_id,
            debit,
            credit
        });

        res.status(201).json(newTransactionDetail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **Update Transaction Detail**
exports.updateTransactionDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { transaction_id, account_id, debit, credit } = req.body;

        const transactionDetail = await TransactionDetail.findByPk(id);
        if (!transactionDetail) {
            return res.status(404).json({ message: "Transaction Detail not found" });
        }

        await transactionDetail.update({ transaction_id, account_id, debit, credit });

        res.status(200).json(transactionDetail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **Delete Transaction Detail**
exports.deleteTransactionDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const transactionDetail = await TransactionDetail.findByPk(id);

        if (!transactionDetail) {
            return res.status(404).json({ message: "Transaction Detail not found" });
        }

        await transactionDetail.destroy();
        res.status(200).json({ message: "Transaction Detail deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bulkDelete = async (req, res) => {
    try {
        const transactions = await TransactionDetail.findAll();

        if (transactions.length === 0) {
            return res.status(404).json({ message: "Tidak ada transaksi untuk dihapus" });
        }

        await TransactionDetail.destroy({ where: {}});

        return res.status(200).json({ success: true, message: "Semua transaksi berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}    
