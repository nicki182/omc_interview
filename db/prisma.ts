import { PrismaClient } from "../generated/prisma";
export type {
  Temperature,
  Malfunction,
  Sensor,
  AggregatedTemperature,
} from "../generated/prisma";
export { Time, Face } from "../generated/prisma";
const prisma = new PrismaClient();
export default prisma;
