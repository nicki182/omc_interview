import type { AggregatedTemperature } from "@prisma_client";

export type { AggregatedTemperature } from "@prisma_client";
export { Time } from "@prisma_client";
export type NewAggregatedTemperature = Omit<
  AggregatedTemperature,
  "id" | "createdAt" | "updatedAt"
>;
