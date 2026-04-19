// QuickBooks Routes
// Mount these routes in your main Express app

const express = require("express");
const router = express.Router();
const quickbooksController = require("../Controller/Quickbooks.controller");
const ledgerController = require("../Controller/Ledger.controller")
// Redirect user to Intuit login page
router.get("/connect", quickbooksController.connect);

// Intuit calls this after user approves access
router.get("/callback", quickbooksController.callback);

// Refresh the access token using the stored refresh token
router.post("/refresh", quickbooksController.refreshToken);

// Fetch all account ledger
router.get("/rent-expenses/:realmId/:targetAccount/:startDate/:endDate", ledgerController.getRentExpenses);

module.exports = router;