module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("Transaction", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        transaction_date: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        timestamps: true
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, { foreignKey: "user_id" });
        Transaction.hasMany(models.TransactionDetail, { foreignKey: "transaction_id" });
    };

    return Transaction;
};
