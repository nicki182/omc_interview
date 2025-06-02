-- DropIndex
DROP INDEX "malfunctions_timestamp_key";

-- DropIndex
DROP INDEX "temperatures_timestamp_key";

-- AlterTable
ALTER TABLE "aggregated_temperatures" ALTER COLUMN "timestamp" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "malfunctions" ALTER COLUMN "timestamp" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "temperatures" ALTER COLUMN "timestamp" SET DATA TYPE BIGINT;
