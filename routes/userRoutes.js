const express = require('express');
const UserController = require("../controllers/userController.js")
const router = express.Router();
const LoginController = require("../controllers/loginController.js")

//User Routes
router.get("/users", LoginController.verifyMe, UserController.getAllUsers);
router.get("/users/:id", LoginController.verifyMe, UserController.getUser);
router.post("/users", UserController.addUser);
router.patch("/users/:id", LoginController.verifyMe, UserController.updateUser);
router.delete("/users/:id", LoginController.verifyMe, UserController.deleteUser);
router.delete("/users", LoginController.verifyMe, UserController.bulkDelete);

//Login routes
router.post("/login", LoginController.loginUser)

module.exports = router;