-- CreateTable
CREATE TABLE "Seaport" (
    "id" TEXT NOT NULL,
    "portName" TEXT NOT NULL,
    "locode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timezoneOlson" TEXT,
    "countryIso" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seaport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seaport_locode_key" ON "Seaport"("locode");
