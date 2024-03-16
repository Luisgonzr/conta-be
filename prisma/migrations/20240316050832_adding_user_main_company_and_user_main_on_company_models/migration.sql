-- CreateTable
CREATE TABLE "UserMain" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "verificationToken" TEXT,
    "verificationDeadline" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userMainId" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMainOnCompany" (
    "userMainId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "UserMainOnCompany_pkey" PRIMARY KEY ("userMainId","companyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMain_email_key" ON "UserMain"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userMainId_key" ON "Company"("userMainId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userMainId_fkey" FOREIGN KEY ("userMainId") REFERENCES "UserMain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMainOnCompany" ADD CONSTRAINT "UserMainOnCompany_userMainId_fkey" FOREIGN KEY ("userMainId") REFERENCES "UserMain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMainOnCompany" ADD CONSTRAINT "UserMainOnCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
