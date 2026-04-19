
const ledgerService = require("../Services/Ledger.service");

const ledgerController = {
     
    async getRentExpenses(req, res) {
     const { realmId, targetAccount, startDate, endDate } = req.params;

    try {

const result = await ledgerService.getRentExpenseTransactions(realmId, targetAccount, startDate, endDate);

      res.status(200).json({
        success: true,
        data: {
          transactions: result.transactions,
          total: result.total,
          currency: "USD",
        },
      });
    } catch (error) {
      console.error("Ledger fetch error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch ledger data yash shiva" });
    }
  },
};

module.exports = ledgerController;