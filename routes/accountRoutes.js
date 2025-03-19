const express = require('express');
const AccountController = require('../controllers/accountController.js')
const router = express.Router();
const LoginController = require("../controllers/loginController.js");

router.get('/accounts', LoginController.verifyMe, AccountController.getAllAccount);
router.get('/accounts/:id', LoginController.verifyMe, AccountController.getAccountById);
router.post('/accounts', LoginController.verifyMe, AccountController.addNewAccount);
router.patch('/accounts/:id', LoginController.verifyMe, AccountController.updateAccount);
router.delete('/accounts/:id', LoginController.verifyMe, AccountController.deleteAccount);

module.exports = router;