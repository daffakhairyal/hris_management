module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define("Account", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 4
            }
        },
        balance: {
            type: DataTypes.DECIMAL(15,2),
            allowNull: false,
            defaultValue: 0.00,
        }
    }, {
        timestamps: true
    });

    Account.associate = (models) => {
        Account.hasMany(models.TransactionDetail, {
            foreignKey: "account_id",
            as: "transactionDetails", // Alias untuk asosiasi transaction details
        });
    };

    return Account;
};