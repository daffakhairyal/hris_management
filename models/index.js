const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import model table
db.User = require('./userModel.js')(sequelize, Sequelize);
db.Account = require('./accountModel.js')(sequelize, Sequelize);
db.Transaction = require('./transactionModel.js')(sequelize, Sequelize);
db.TransactionDetail = require('./transactionDetailModel.js')(sequelize, Sequelize);
db.Attendance = require('./absensiModel.js')(sequelize, Sequelize);


Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

//syncing db to server
// db.sequelize.sync({ force: true }) 
//   .then(() => console.log("Database synced"))
//   .catch((error) => console.log(error.message));

//export config
module.exports = db;

