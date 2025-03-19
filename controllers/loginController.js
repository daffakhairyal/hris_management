const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        //check user
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password" });
        }

        // matching password with hashedPassword
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        //get browser and ip address information
        const userAgent = req.headers["user-agent"] || "Unknown";
        const ip = req.headers["x-forwarded-for"] || req.ip || "Unknown";

        //generate token if user logged in
        const token = jwt.sign(
            { 
                id: user.id, 
                name: user.name, 
                email: user.email,
                division: user.division,
                position: user.position,
                userAgent,  
                ip          
            },            
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        //if user logged in, return these message
        return res.status(200).json({ 
            success: true, 
            message: "Login Successful", 
            token,
            data: { id: user.id, name: user.name, email: user.email , position: user.position, division:user.division} 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

const verifyMe = (req,res,next)=>{
    const token = req.headers['authorization'] && req.headers['authorization'].split(" ")[1];
    if (!token){
       return  res.status(401).json({success:false, message:'Unauthorized'});
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
}

module.exports = { loginUser, verifyMe };
