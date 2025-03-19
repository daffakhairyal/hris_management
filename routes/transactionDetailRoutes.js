const express = require("express");
const router = express.Router();
const transactionDetailController = require("../controllers/transactionDetailController");
const LoginController = require("../controllers/loginController");

router.get("/details", LoginController.verifyMe, transactionDetailController.getAllTransactionDetails);
router.get("/details/:id", LoginController.verifyMe, transactionDetailController.getTransactionDetailById);
router.post("/details", LoginController.verifyMe, transactionDetailController.createTransactionDetail);
router.put("/details/:id", LoginController.verifyMe, transactionDetailController.updateTransactionDetail);
router.delete("/details/:id", LoginController.verifyMe, transactionDetailController.deleteTransactionDetail);
router.delete("/details/", LoginController.verifyMe, transactionDetailController.bulkDelete);

module.exports = router;
