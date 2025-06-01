-- CreateEnum
CREATE TYPE "Time" AS ENUM ('HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "Face" AS ENUM ('SOUTH', 'EAST', 'NORTH', 'WEST');

-- CreateTable
CREATE TABLE "temperatures" (
    "id" SERIAL NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "sensor_id" INTEGER NOT NULL,
    "temperature_value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "temperatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malfunctions" (
    "id" SERIAL NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "sensor_id" INTEGER NOT NULL,
    "temperature_value" DOUBLE PRECISION NOT NULL,
    "deviation" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "malfunctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensors" (
    "id" SERIAL NOT NULL,
    "face" "Face" NOT NULL DEFAULT 'SOUTH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aggregated_temperatures" (
    "id" SERIAL NOT NULL,
    "face" "Face" NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "temperature_value" DOUBLE PRECISION NOT NULL,
    "time" "Time" NOT NULL DEFAULT 'HOUR',

    CONSTRAINT "aggregated_temperatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "temperatures_timestamp_key" ON "temperatures"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "malfunctions_timestamp_key" ON "malfunctions"("timestamp");

-- AddForeignKey
ALTER TABLE "temperatures" ADD CONSTRAINT "temperatures_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malfunctions" ADD CONSTRAINT "malfunctions_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
