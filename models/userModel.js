module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        division: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps : true
    });
    
    User.associate = (models) => {
        User.hasMany(models.Attendance, { foreignKey: "user_id", as: "attendances" });
    };

    return User;
};