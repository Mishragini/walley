-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "accountIndex" DROP DEFAULT;
DROP SEQUENCE "Account_accountIndex_seq";
