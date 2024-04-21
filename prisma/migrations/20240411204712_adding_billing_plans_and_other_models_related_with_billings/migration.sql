-- CreateTable
CREATE TABLE "BusinessBillingPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "taxCode" TEXT,
    "taxMeasurementUnit" TEXT,
    "taxMeasurementUnitName" TEXT,
    "stripeId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessBillingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricBusinessBillingPlanPerCompany" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "businessBillingPlanId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HistoricBusinessBillingPlanPerCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessTaxCatalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "taxFactor" TEXT NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,
    "base" TEXT DEFAULT '100% del subtotal',
    "taxAWithheldByCustomer" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessTaxCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInvoice" (
    "id" TEXT NOT NULL,
    "facturapiId" TEXT NOT NULL,
    "facturapiCreatedAt" TIMESTAMP(3) NOT NULL,
    "livemode" BOOLEAN NOT NULL,
    "stampDate" TIMESTAMP(3),
    "emissionDate" TIMESTAMP(3),
    "cfdiVersion" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "verificationUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cancellationStatus" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "uuid" TEXT NOT NULL,
    "use" TEXT NOT NULL,
    "folioNumber" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "paymentForm" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "exchange" DOUBLE PRECISION NOT NULL,
    "legalName" TEXT,
    "taxId" TEXT,
    "taxZipCode" TEXT,
    "taxSystem" TEXT,
    "emitterLegalName" TEXT,
    "emitterTaxId" TEXT,
    "emitterTaxZipCode" TEXT,
    "emitterTaxSystem" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BusinessInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BusinessBillingPlanToBusinessTaxCatalog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BusinessBillingPlanToBusinessTaxCatalog_AB_unique" ON "_BusinessBillingPlanToBusinessTaxCatalog"("A", "B");

-- CreateIndex
CREATE INDEX "_BusinessBillingPlanToBusinessTaxCatalog_B_index" ON "_BusinessBillingPlanToBusinessTaxCatalog"("B");

-- AddForeignKey
ALTER TABLE "HistoricBusinessBillingPlanPerCompany" ADD CONSTRAINT "HistoricBusinessBillingPlanPerCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricBusinessBillingPlanPerCompany" ADD CONSTRAINT "HistoricBusinessBillingPlanPerCompany_businessBillingPlanI_fkey" FOREIGN KEY ("businessBillingPlanId") REFERENCES "BusinessBillingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessInvoice" ADD CONSTRAINT "BusinessInvoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessBillingPlanToBusinessTaxCatalog" ADD CONSTRAINT "_BusinessBillingPlanToBusinessTaxCatalog_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessBillingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessBillingPlanToBusinessTaxCatalog" ADD CONSTRAINT "_BusinessBillingPlanToBusinessTaxCatalog_B_fkey" FOREIGN KEY ("B") REFERENCES "BusinessTaxCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
