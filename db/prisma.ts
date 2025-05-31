import { PrismaClient } from "../generated/prisma";
export {
  Temperature,
  Malfunction,
  Face,
  Sensor,
} from "../generated/prisma/client";
const prisma = new PrismaClient();
export default prisma;
