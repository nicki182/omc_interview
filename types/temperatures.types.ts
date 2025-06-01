import { Face, Sensor, Temperature } from "@prisma_client";

export interface TemperatureWithSensor extends Temperature {
  sensor?: Sensor;
}
export type NewTemperature = Omit<Temperature, "id">;

export interface Reading extends NewTemperature {
  face?: Face; // Optional face field to determine the sensor's face
}
