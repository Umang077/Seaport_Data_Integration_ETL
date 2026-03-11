/*
  Warnings:

  - A unique constraint covering the columns `[locode,portName,latitude,longitude]` on the table `Seaport` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Seaport_locode_key";

-- CreateIndex
CREATE UNIQUE INDEX "Seaport_locode_portName_latitude_longitude_key" ON "Seaport"("locode", "portName", "latitude", "longitude");
