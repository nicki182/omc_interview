import type { Sensor, Malfunction } from "@prisma_client";

export type { Malfunction } from "@prisma_client";
export interface MalfunctionWithSensor extends Malfunction {
  sensor?: Sensor;
}
export type NewMalfunction = Omit<
  Malfunction,
  "id" | "createdAt" | "updatedAt"
>;
