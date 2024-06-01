/*
  Warnings:

  - Added the required column `stripeId` to the `MarketingEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarketingEmail" ADD COLUMN     "stripeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserMain" ALTER COLUMN "password" DROP NOT NULL;
