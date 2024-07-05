-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Organisation" (
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("orgId")
);

-- CreateTable
CREATE TABLE "UserOrganisation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "founder" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserOrganisation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_orgId_key" ON "Organisation"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOrganisation_id_key" ON "UserOrganisation"("id");

-- AddForeignKey
ALTER TABLE "UserOrganisation" ADD CONSTRAINT "UserOrganisation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganisation" ADD CONSTRAINT "UserOrganisation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
