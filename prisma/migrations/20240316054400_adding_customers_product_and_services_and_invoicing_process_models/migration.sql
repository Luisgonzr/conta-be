-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "companyName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerTaxProfile" (
    "id" TEXT NOT NULL,
    "taxId" TEXT,
    "taxName" TEXT,
    "taxSystem" TEXT,
    "taxZipCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "CustomerTaxProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAndService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "internalIdCode" TEXT,
    "price" DOUBLE PRECISION,
    "taxCode" TEXT NOT NULL,
    "taxMeasurementUnit" TEXT NOT NULL,
    "taxMeasurementUnitName" TEXT NOT NULL,
    "show" BOOLEAN DEFAULT true,
    "isService" BOOLEAN DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "productAndServiceCategoryId" TEXT,

    CONSTRAINT "ProductAndService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAndServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taxCode" TEXT NOT NULL,
    "taxMeasurementUnit" TEXT NOT NULL,
    "taxMeasurementUnitName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "ProductAndServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxCatalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "taxFactor" TEXT NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,
    "base" TEXT DEFAULT '100% del subtotal',
    "taxAWithheldByCustomer" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProformaInvoice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "terms" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "customerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isProspect" BOOLEAN NOT NULL DEFAULT false,
    "prospectCompanyName" TEXT,
    "prospectContactName" TEXT,
    "prospectContactEmail" TEXT,
    "prospectContactPhone" TEXT,
    "totalPreTaxes" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProformaInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProformaInvoiceItem" (
    "id" TEXT NOT NULL,
    "proformaInvoiceId" TEXT NOT NULL,
    "productAndServiceId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProformaInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
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
    "salesQuoteId" TEXT,
    "legalName" TEXT,
    "taxId" TEXT,
    "taxZipCode" TEXT,
    "taxSystem" TEXT,
    "customerId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductAndServiceToTaxCatalog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductAndServiceCategoryToTaxCatalog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerTaxProfile_customerId_key" ON "CustomerTaxProfile"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductAndServiceToTaxCatalog_AB_unique" ON "_ProductAndServiceToTaxCatalog"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductAndServiceToTaxCatalog_B_index" ON "_ProductAndServiceToTaxCatalog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductAndServiceCategoryToTaxCatalog_AB_unique" ON "_ProductAndServiceCategoryToTaxCatalog"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductAndServiceCategoryToTaxCatalog_B_index" ON "_ProductAndServiceCategoryToTaxCatalog"("B");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTaxProfile" ADD CONSTRAINT "CustomerTaxProfile_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAndService" ADD CONSTRAINT "ProductAndService_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAndService" ADD CONSTRAINT "ProductAndService_productAndServiceCategoryId_fkey" FOREIGN KEY ("productAndServiceCategoryId") REFERENCES "ProductAndServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAndServiceCategory" ADD CONSTRAINT "ProductAndServiceCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxCatalog" ADD CONSTRAINT "TaxCatalog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceItem" ADD CONSTRAINT "ProformaInvoiceItem_proformaInvoiceId_fkey" FOREIGN KEY ("proformaInvoiceId") REFERENCES "ProformaInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceItem" ADD CONSTRAINT "ProformaInvoiceItem_productAndServiceId_fkey" FOREIGN KEY ("productAndServiceId") REFERENCES "ProductAndService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_salesQuoteId_fkey" FOREIGN KEY ("salesQuoteId") REFERENCES "ProformaInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAndServiceToTaxCatalog" ADD CONSTRAINT "_ProductAndServiceToTaxCatalog_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductAndService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAndServiceToTaxCatalog" ADD CONSTRAINT "_ProductAndServiceToTaxCatalog_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAndServiceCategoryToTaxCatalog" ADD CONSTRAINT "_ProductAndServiceCategoryToTaxCatalog_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductAndServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAndServiceCategoryToTaxCatalog" ADD CONSTRAINT "_ProductAndServiceCategoryToTaxCatalog_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
