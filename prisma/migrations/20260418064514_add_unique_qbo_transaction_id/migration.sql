/*
  Warnings:

  - A unique constraint covering the columns `[qboTransactionId]` on the table `rent_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rent_transactions_qboTransactionId_key" ON "rent_transactions"("qboTransactionId");
