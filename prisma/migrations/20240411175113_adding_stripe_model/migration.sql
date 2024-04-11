-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "stripeId" TEXT;

-- AlterTable
ALTER TABLE "ProductAndService" ALTER COLUMN "taxCode" DROP NOT NULL,
ALTER COLUMN "taxMeasurementUnit" DROP NOT NULL,
ALTER COLUMN "taxMeasurementUnitName" DROP NOT NULL;

-- CreateTable
CREATE TABLE "StripeCheckout" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "amountTotal" DOUBLE PRECISION NOT NULL,
    "cancelUrl" TEXT NOT NULL,
    "successUrl" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "subscription" TEXT,
    "clientReferenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeCheckout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripeCheckout" ADD CONSTRAINT "StripeCheckout_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
