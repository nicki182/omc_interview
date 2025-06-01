import { Sensor, Malfunction } from "@prisma_client";

export interface MalfunctionWithSensor extends Malfunction {
  sensor?: Sensor;
}
