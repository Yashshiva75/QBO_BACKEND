const QuickBooks = require("node-quickbooks");
const quickbooksAuthService = require("../Services/Quickbooks.service");


async function getQBClient(realmId) {
  const tokens = await quickbooksAuthService.getValidTokens(realmId);
  return new QuickBooks(
    process.env.QB_CLIENT_ID,
    process.env.QB_CLIENT_SECRET,
    tokens.accessToken,
    false,
    tokens.realmId,
    process.env.QB_ENVIRONMENT === "sandbox",
    true, 
    null,
    "2.0",
    tokens.refreshToken
  );
}

const ledgerRepository = {

  async fetchJournalEntriesByDateRange(realmId, startDate, endDate) {
    const qbo = await getQBClient(realmId);

    return new Promise((resolve, reject) => {
      qbo.findJournalEntries(
        [
          { field: 'TxnDate', value: startDate, operator: '>=' },
          { field: 'TxnDate', value: endDate, operator: '<=' }
        ],
        (err, data) => {
          if (err) {
            console.error("QBO API Error:", err.Fault?.Error?.[0]?.Message || err);
            return reject(err);
          }

          const entries = data?.QueryResponse?.JournalEntry || [];          
          resolve(entries);
        }
      );
    });
  },
};

module.exports = ledgerRepository;