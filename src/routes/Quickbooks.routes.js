const express = require("express");
const router = express.Router();
const quickbooksController = require("../Controller/Quickbooks.controller");
const ledgerController = require("../Controller/Ledger.controller")
// Redirect user to Intuit login page
router.get("/connect", quickbooksController.connect);

// Intuit calls this after user approves access
router.get("/callback", quickbooksController.callback);

// Fetch all account ledger
router.get("/rent-expenses/:realmId/:targetAccount/:startDate/:endDate", ledgerController.getRentExpenses);

module.exports = router;