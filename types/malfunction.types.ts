import { Sensor, Malfunction } from "@prisma_client";

export { Malfunction } from "@prisma_client";
export interface MalfunctionWithSensor extends Malfunction {
  sensor?: Sensor;
}
export type NewMalfunction = Omit<
  Malfunction,
  "id" | "createdAt" | "updatedAt"
>;
