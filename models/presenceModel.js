module.exports = (sequelize, DataTypes) => {
    const Presence = sequelize.define("Presence", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users", // Harus sesuai dengan nama tabel User
                key: "id",
            },
            onDelete: "CASCADE",
        },
        checkIn: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        },
        checkOut: {
            type: DataTypes.DATE,
            allowNull: true, // Bisa null karena user mungkin belum check-out
        },
        latitude: {
            type: DataTypes.DECIMAL(9,6),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(9,6),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("Hadir", "Terlambat", "Izin", "Sakit"),
            allowNull: false,
            defaultValue: "Hadir",
        },
        photoUrl: {
            type: DataTypes.STRING,
            allowNull: false, // Foto wajib ada sebagai bukti presensi
        },
    }, {
        timestamps: true
    });

    Presence.associate = (models) => {
        Presence.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
        });
    };

    return Presence;
};
