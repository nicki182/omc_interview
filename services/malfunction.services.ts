import { MalfunctionDTO } from "@dto";
import PrismaClient from "@prisma_client";
import redis from "@redis";
import {
  CRUDService,
  MalfunctionWithSensor,
  Malfunction,
  NewMalfunction,
} from "@types";
import logger from "@utils/logger";
class MalfunctionServices
  implements CRUDService<MalfunctionDTO, MalfunctionWithSensor>
{
  private prisma = PrismaClient;
  private redis = redis;
  private cacheKey = "malfunction _";
  private deviation = 20; // Default deviation threshold
  private getRedisClient() {
    return this.redis.getClient();
  }
  public async create(data: NewMalfunction): Promise<MalfunctionDTO> {
    const malfunction = await this.prisma.malfunction.create({
      data: {
        sensor_id: data.sensor_id,
        timestamp: data.timestamp,
        temperature_value: data.temperature_value,
        deviation: data.deviation,
      },
    });
    // Cache the created malfunction
    await this.getRedisClient().set(
      `${this.cacheKey}${malfunction.id}`,
      JSON.stringify({
        ...malfunction,
        timestamp: malfunction.timestamp.toString(),
      }), // Convert timestamp to string for JSON compatibility
    );
    logger.info(`Malfunction created with ID: ${malfunction.id}`);
    return MalfunctionDTO.from(malfunction);
  }
  public async list(): Promise<MalfunctionDTO[]> {
    const malfunctions = await this.prisma.malfunction.findMany({});
    logger.info(
      `Retrieved ${malfunctions.length} malfunctions from the database`,
    );
    return malfunctions.map(MalfunctionDTO.from);
  }
  public async read(id: number): Promise<MalfunctionDTO | null> {
    const cachedMalfunction = await this.getRedisClient().get(
      `${this.cacheKey}${id}`,
    );
    if (cachedMalfunction) {
      return MalfunctionDTO.from(JSON.parse(cachedMalfunction));
    }
    const malfunction = await this.prisma.malfunction.findUnique({
      where: { id },
      include: { sensor: true }, // Include sensor details if needed
    });
    if (malfunction) {
      await this.getRedisClient().set(
        `${this.cacheKey}${id}`,
        JSON.stringify({
          ...malfunction,
          timestamp: malfunction.timestamp.toString(),
        }), // Convert timestamp to string for JSON compatibility
      );
      logger.info(`Malfunction with ID: ${id} retrieved from the database`);
      return MalfunctionDTO.from(malfunction);
    }
    return null;
  }
  public async update(
    id: number,
    data: Malfunction,
  ): Promise<MalfunctionDTO | null> {
    const malfunction = await this.prisma.malfunction.update({
      where: { id },
      data: {
        sensor_id: data.sensor_id,
        timestamp: data.timestamp,
        temperature_value: data.temperature_value,
        deviation: data.deviation,
      },
    });
    // Update the cache
    await this.getRedisClient().set(
      `${this.cacheKey}${id}`,
      JSON.stringify({
        ...malfunction,
        timestamp: malfunction.timestamp.toString(),
      }), // Convert timestamp to string for JSON compatibility
    );
    logger.info(`Malfunction with ID: ${id} updated`);
    return MalfunctionDTO.from(malfunction);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.malfunction.delete({
      where: { id },
    });
    // Remove from cache
    await this.getRedisClient().del(`${this.cacheKey}${id}`);
    logger.info(`Malfunction with ID: ${id} deleted`);
  }
  public isDeviationExceeded(
    temperatureAverageSensor: number,
    temperatureAverageFace: number,
  ): boolean {
    const deviation = this.calculateDeviation(
      temperatureAverageSensor,
      temperatureAverageFace,
    );
    return deviation > this.deviation;
  }
  public calculateDeviation(
    temperatureAverageSensor: number,
    temperatureAverageFace: number,
  ): number {
    return (
      (Math.abs(temperatureAverageFace - temperatureAverageSensor) /
        temperatureAverageSensor) *
      100
    ); // Calculate percentage deviation
  }
}
export const malfunctionServices = new MalfunctionServices();
