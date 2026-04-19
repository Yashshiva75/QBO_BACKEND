const ledgerRepository = require("../Repository/Ledger.repository");
const prisma = require("../db/db");

const ledgerService = {
  async getRentExpenseTransactions(realmId, targetAccount, startDate, endDate) {
    const entries = await ledgerRepository.fetchJournalEntriesByDateRange(
      realmId,
      startDate,
      endDate
    );

    const transactions = [];
    const normalizedTarget = targetAccount.trim().toLowerCase();

    for (const entry of entries) {
      const lines = entry.Line || [];

      for (const line of lines) {
        const detail = line?.JournalEntryLineDetail;
        const accountRef = detail?.AccountRef;
        const accountName = accountRef?.name?.trim().toLowerCase();

        // DYNAMIC FILTER: Matches the account you pass in the URL
        if (accountName === normalizedTarget) {
          const rawAmount = parseFloat(line.Amount) || 0;
          const finalAmount = Math.abs(rawAmount);

          transactions.push({
            realmId,
            transactionDate: new Date(entry.TxnDate),
            description: line.Description || entry.PrivateNote || `Transaction: ${targetAccount}`,
            amount: finalAmount,
            qboTransactionId: `${entry.Id}-${line.Id}`,
            category: targetAccount 
          });
        }
      }
    }

    transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

    
    if (transactions.length > 0) {
 

  await prisma.rentTransaction.createMany({
    data: transactions.map(t => ({
      realmId: t.realmId,
      transactionDate: t.transactionDate,
      description: t.description,
      amount: t.amount,
      qboTransactionId: t.qboTransactionId,
      category: t.category,
    })),
    skipDuplicates: true,
  });
  console.log(`Saved ${transactions.length} transactions to DB`);
}

    const totalSum = transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      transactions: transactions.map(t => ({
        ...t,
        amount: t.amount.toFixed(2)
      })),
      total: totalSum.toFixed(2),
      accountName: targetAccount
    };
  },
};

module.exports = ledgerService;