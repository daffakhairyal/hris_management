module.exports = (sequelize, DataTypes) => {
    const TransactionDetail = sequelize.define("TransactionDetail", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        transaction_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Transactions", // Nama tabel yang dirujuk
                key: "id",
            },
            onDelete: "CASCADE",
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Accounts", // Nama tabel yang dirujuk
                key: "id",
            },
            onDelete: "CASCADE",
        },
        debit: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
            validate: {
                min: 0,
            },
        },
        credit: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
            validate: {
                min: 0,
            },
        },
    }, {
        timestamps: true,
        tableName: "transaction_details",
    });

    // Pastikan asosiasi dengan Account sudah benar
    TransactionDetail.associate = (models) => {
        TransactionDetail.belongsTo(models.Transaction, {
            foreignKey: "transaction_id",
            as: "transaction", // Alias untuk asosiasi transaksi
        });
        TransactionDetail.belongsTo(models.Account, {
            foreignKey: "account_id", // Pastikan ini sesuai dengan nama kolom foreign key
            as: "account", // Alias untuk asosiasi akun
        });
    };

    return TransactionDetail;
};
