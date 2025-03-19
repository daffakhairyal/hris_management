const db = require("../models");
const Account = db.Account;

// Mapping untuk account_type
const accountTypeMap = {
    0: "asset",
    1: "liability",
    2: "equity",
    3: "revenue",
    4: "expense"
};

const getAllAccount = async (req, res) => {
    try {
        const accounts = await Account.findAll();
        
        //convert account_type to string based on accountTypeMap
        const formattedAccounts = accounts.map(account => ({
            ...account.toJSON(),
            account_type: accountTypeMap[account.account_type] || "unknown"
        }));

        res.status(200).json({ success: true, data: formattedAccounts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getAccountById = async (req, res) => {
    const {id} = req.params
    try {
        const account = await Account.findByPk(id);
        if (!account) {
            return res.status(404).json({ message: "Account Not Found" });
        }

        //convert account_type to string based on accountTypeMap
        const formattedAccount = {
            ...account.toJSON(),
            account_type: accountTypeMap[account.account_type] || "unknown"
        };

        res.status(200).json({ success: true, data: formattedAccount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const addNewAccount = async (req, res) => {
    const { name, account_type, balance } = req.body;
    try {
        const addNew = await Account.create({ name, account_type, balance });
        res.status(200).json({ success: true, data: addNew});
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { name, account_type, balance } = req.body;

    try {
        const account = await Account.findByPk(id);
        if (!account) {
            return res.status(404).json({ success: false, message: "Account Not Found!" });
        }
        await account.update({ name, account_type, balance });
        res.status(200).json({ success: true, data: account });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteAccount = async (req,res)=>{
    const {id} = req.params;
    try {
        const account = await Account.findByPk(id);
        if(!account){
            return res.status(404).json({success:false, message:"Account Not Found"})
        }
        await account.destroy();
        res.status(200).json({success:true, message:"Account Deleted"})
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


module.exports = { getAllAccount, getAccountById, addNewAccount, updateAccount, deleteAccount };
