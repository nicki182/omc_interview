import { AggregatedTemperature } from "@prisma_client";

export { AggregatedTemperature, Time } from "@prisma_client";
export type NewAggregatedTemperature = Omit<
  AggregatedTemperature,
  "id" | "createdAt" | "updatedAt"
>;
