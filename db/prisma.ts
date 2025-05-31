import { PrismaClient } from "../generated/prisma";
export {
  Temperature,
  Malfunction,
  Face,
  Sensor,
  AggregatedTemperature,
  Time,
} from "../generated/prisma/client";
const prisma = new PrismaClient();
export default prisma;
