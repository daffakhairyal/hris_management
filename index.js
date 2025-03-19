const express = require('express');
const helmet = require("helmet");
const cors =  require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const transactionDetailRoutes = require('./routes/transactionDetailRoutes');
const absensiRoutes = require('./routes/absensiRoutes');
const api = "/api";
const path = require("path");


//Configuration of Express JS
const PORT = process.env.PORT 
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Serve folder uploads agar bisa diakses via URL
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//Middleware Configuration
//CORS
app.use(cors({
    origin:'http://localhost:3000'
}));

//Helmet
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'", "http://localhost:3000"], // Izinkan fetch ke frontend
                fontSrc: ["'self'", "fonts.gstatic.com"],
            },
        },
    })
);

app.use(bodyParser.json());

//routes
app.use(api, userRoutes);
app.use(api, accountRoutes);
app.use(api, transactionRoutes);
app.use(api, transactionDetailRoutes);
app.use(api, absensiRoutes);


//Listen to server
app.listen(PORT, async()=>{
    console.log(`Server berjalan pada PORT ${PORT}`);
    try {
        await db.sequelize.authenticate();
        console.log("Database connected!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})