import { Sensor, Temperature, Malfunction } from "@prisma_client";

export type ReportData = unknown;
export interface Report {
  name: string;
  description: string;
  data: ReportData;
}
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
export interface TemperatureWithSensor extends Temperature {
  sensor?: Sensor;
}
export interface MalfunctionWithSensor extends Malfunction {
  sensor?: Sensor;
}
// CRUDService interface for generic CRUD operations, A is the type of the data being managed and T is the object type for the service.
export interface CRUDService<T, A> {
  create(data: A): Promise<T>;
  read(id: number): Promise<T | null>;
  update(id: number, data: A): Promise<T | null>;
  delete(id: number): Promise<void>;
  list(): Promise<T[]>;
}
