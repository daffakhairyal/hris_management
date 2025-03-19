module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define("Attendance", {
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
            onDelete: "CASCADE",
        },
        check_in: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        check_in_photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        check_out: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        check_out_photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[0, 1, 2, 3, 4]],
            },
            defaultValue: 0,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        check_in_latitude: { type: DataTypes.FLOAT },
        check_in_longitude: { type: DataTypes.FLOAT },
        check_out_latitude: { type: DataTypes.FLOAT }, 
        check_out_longitude: { type: DataTypes.FLOAT },
        
    }, {
        timestamps: true,
    });

    Attendance.associate = (models) => {
        Attendance.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    };

    return Attendance;
};
