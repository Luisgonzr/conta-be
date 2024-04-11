-- CreateTable
CREATE TABLE "CompanyTaxProfile" (
    "id" TEXT NOT NULL,
    "taxId" TEXT,
    "taxName" TEXT,
    "taxSystem" TEXT,
    "taxZipCode" TEXT,
    "taxAddressStreet" TEXT,
    "taxAddressExteriorNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyTaxProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacturapiConfigProfile" (
    "id" TEXT NOT NULL,
    "cerFileName" TEXT,
    "keyFileName" TEXT,
    "invoiceConfigLogoUrl" TEXT,
    "invoiceConfigColorHex" TEXT,
    "invoiceConfigNextFolioNumber" INTEGER NOT NULL DEFAULT 1,
    "invoiceConfigNextFolioNumberTest" INTEGER NOT NULL DEFAULT 1,
    "invoiceConfigPdfShowCodes" BOOLEAN NOT NULL DEFAULT true,
    "invoiceConfigPdfShowProductKey" BOOLEAN NOT NULL DEFAULT true,
    "invoiceConfigPdfRoundUnitPrice" BOOLEAN NOT NULL DEFAULT false,
    "invoiceConfigPdfTaxBreakdown" BOOLEAN NOT NULL DEFAULT true,
    "facturapiOrganizationId" TEXT,
    "facturapiApiKeyProd" TEXT,
    "facturapiApiKeyTest" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "FacturapiConfigProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyTaxProfile_companyId_key" ON "CompanyTaxProfile"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "FacturapiConfigProfile_companyId_key" ON "FacturapiConfigProfile"("companyId");

-- AddForeignKey
ALTER TABLE "CompanyTaxProfile" ADD CONSTRAINT "CompanyTaxProfile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturapiConfigProfile" ADD CONSTRAINT "FacturapiConfigProfile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
