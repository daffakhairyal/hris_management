const db = require("../models");
const User = db.User;
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        return user 
            ? res.json({ success: true, data: user }) 
            : res.status(404).json({ success: false, message: "User not found" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const addUser = async (req, res)=>{
    const {name, email, password, division, position} = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const addNew = await User.create({name, email, password: hashedPassword, division, position});
        res.status(201).json(addNew);
    } catch (error) {
        res.status(500).json({success:false, error: error.message})
    }
};

const updateUser = async (req,res)=>{
    const {id} = req.params
    const {name, email, password, division, position} = req.body;
    try {
        const user = await User.findByPk(id);
        const hashedPassword = password ? await bcrypt.hash(password,12) : user.password;
        return !user ? res.status(404).json({message : "User Not Found"})
        : await user.update({name, email, password:hashedPassword, division, position}) , res.status(200).json({ 
            success: true, 
            message: "User updated successfully", 
            data: user 
        })
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

const deleteUser = async(req,res)=>{
    const {id} = req.params;
    try {
       const user = await User.findByPk(id);
       return !user ? res.status(404).json({success:false, error:error.message}) :
       await user.destroy() , res.status(200).json({success:true, message: "User deleted"})
    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
}

const bulkDelete = async (req, res) => {
    try {
        const users = await User.findAll();

        if (users.length === 0) {
            return res.status(404).json({ message: "Tidak ada data user untuk dihapus" });
        }

        await User.destroy({ where: {}});

        return res.status(200).json({ success: true, message: "Semua user berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}    

module.exports = { getAllUsers, getUser, addUser, updateUser, deleteUser, bulkDelete };
