/*
  Warnings:

  - A unique constraint covering the columns `[accountIndex]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_accountIndex_key" ON "Account"("accountIndex");
