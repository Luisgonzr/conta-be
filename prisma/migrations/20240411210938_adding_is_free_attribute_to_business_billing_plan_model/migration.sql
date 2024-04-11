-- AlterTable
ALTER TABLE "BusinessBillingPlan" ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "stripeId" DROP NOT NULL;
