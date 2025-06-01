import type { Sensor, Malfunction, Temperature } from "@prisma_client";

export type { Sensor } from "@prisma_client";
export { Face } from "@prisma_client";
export interface SensorWithTemperatures extends Sensor {
  temperatures: Temperature[];
}
export interface SensorWithMalfunctions extends Sensor {
  malfunctions: Malfunction[];
}
export interface SensorWithTemperaturesAndMalfunctions extends Sensor {
  temperatures?: Temperature[];
  malfunctions?: Malfunction[];
}
export type NewSensor = Omit<Sensor, "id" | "updatedAt" | "createdAt">;
