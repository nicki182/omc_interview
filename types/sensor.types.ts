import { Sensor, Temperature, Malfunction } from "@prisma_client";

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
