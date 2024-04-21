-- CreateTable
CREATE TABLE "WebhookDummy" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookDummy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingsPerPeriod" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "action" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BillingsPerPeriod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillingsPerPeriod" ADD CONSTRAINT "BillingsPerPeriod_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
