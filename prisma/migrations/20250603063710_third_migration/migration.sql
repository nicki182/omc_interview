/*
  Warnings:

  - You are about to drop the column `temperature_value` on the `aggregated_temperatures` table. All the data in the column will be lost.
  - You are about to drop the column `temperature_value` on the `malfunctions` table. All the data in the column will be lost.
  - Added the required column `average_temperature_value` to the `aggregated_temperatures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `average_temperature_value` to the `malfunctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "aggregated_temperatures" DROP COLUMN "temperature_value",
ADD COLUMN     "average_temperature_value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "malfunctions" DROP COLUMN "temperature_value",
ADD COLUMN     "average_temperature_value" DOUBLE PRECISION NOT NULL;
