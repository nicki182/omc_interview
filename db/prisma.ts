import { PrismaClient } from "../generated/prisma";
import { Face } from "../generated/prisma";
export type {
  Temperature,
  Malfunction,
  Sensor,
  AggregatedTemperature,
} from "../generated/prisma";
export { Time, Face } from "../generated/prisma";
console.log(Face);
const prisma = new PrismaClient();
export default prisma;
