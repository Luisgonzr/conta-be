/*
  Warnings:

  - Made the column `currentBusinessBillingPlanId` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "currentBusinessBillingPlanId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_currentBusinessBillingPlanId_fkey" FOREIGN KEY ("currentBusinessBillingPlanId") REFERENCES "BusinessBillingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
