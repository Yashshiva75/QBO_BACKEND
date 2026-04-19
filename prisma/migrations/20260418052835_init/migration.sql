-- CreateTable
CREATE TABLE "QboToken" (
    "id" SERIAL NOT NULL,
    "realmId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QboToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rent_transactions" (
    "id" SERIAL NOT NULL,
    "realmId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "qboTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rent_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QboToken_realmId_key" ON "QboToken"("realmId");

-- AddForeignKey
ALTER TABLE "rent_transactions" ADD CONSTRAINT "rent_transactions_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "QboToken"("realmId") ON DELETE RESTRICT ON UPDATE CASCADE;
