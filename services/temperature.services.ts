import { TemperatureDTO } from "@dto";
import PrismaClient from "@prisma_client";
import redis from "@redis";
import {
  CRUDService,
  NewTemperature,
  TemperatureWithSensor,
  Temperature,
} from "@types";
class TemperatureServices
  implements CRUDService<TemperatureDTO, TemperatureWithSensor>
{
  private prisma = PrismaClient;
  private redis = redis;
  private cacheKey = "temperature";
  private getRedisClient() {
    return this.redis.getClient();
  }
  private createCacheKey(temperature: Temperature): string {
    return `${this.cacheKey}_${new Date(Number(temperature.timestamp) * 1000).getHours()}`;
  }
  public async create(data: NewTemperature): Promise<TemperatureDTO> {
    const temperature = await this.prisma.temperature.create({
      data: {
        timestamp: data.timestamp,
        sensor_id: data.sensor_id,
        temperature_value: data.temperature_value,
      },
      include: {
        sensor: true, // Include sensor details
      },
    });
    const cacheKey = this.createCacheKey(temperature);
    await this.getRedisClient().LPUSH(
      cacheKey,
      JSON.stringify({
        ...temperature,
        timestamp: temperature.timestamp.toString(),
      }),
    ); // Convert timestamp to string for JSON compatibility
    await this.getRedisClient().expire(cacheKey, 7200); // 2 hour TTL
    return TemperatureDTO.from(temperature);
  }
  public async list(): Promise<TemperatureDTO[]> {
    const temperatures = await this.prisma.temperature.findMany({
      include: {
        sensor: true,
      },
    });
    return temperatures.map(TemperatureDTO.from);
  }
  public async read(id: number): Promise<TemperatureDTO | null> {
    const temperature = await this.prisma.temperature.findUnique({
      where: { id },
      include: { sensor: true },
    });
    if (temperature) {
      return TemperatureDTO.from(temperature);
    }
    return null;
  }
  public async update(
    id: number,
    data: TemperatureWithSensor,
  ): Promise<TemperatureDTO | null> {
    const temperature = await this.prisma.temperature.update({
      where: { id },
      data: {
        timestamp: data.timestamp,
        sensor_id: data.sensor_id,
        temperature_value: data.temperature_value,
      },
    });
    return TemperatureDTO.from(temperature);
  }

  public aggregateTemperatureFromTemperatures(
    temperatures: TemperatureDTO[],
  ): number {
    return (
      temperatures.reduce((sum, temp) => sum + temp.getTemperatureValue(), 0) /
      temperatures.length
    ); // Calculate average
  }

  public async delete(id: number): Promise<void> {
    const temperature = await this.prisma.temperature.delete({
      where: { id },
    });
    // Remove from cache
    await this.getRedisClient().del(this.createCacheKey(temperature));
  }
  public async getTemperaturesOfHour(): Promise<TemperatureDTO[]> {
    const cacheKey = `${this.cacheKey}_${new Date().getHours() - 1}`;
    const cachedTemperatures = await this.getRedisClient().LRANGE(
      cacheKey,
      0,
      -1,
    );
    if (cachedTemperatures.length > 0) {
      return cachedTemperatures.map((temp) =>
        TemperatureDTO.from(JSON.parse(temp)),
      );
    }
    const temperatures = await this.prisma.temperature.findMany({
      where: {
        timestamp: {
          gte: (new Date().getHours() - 1) * 3600 * 1000, // Start of the hour
          lt: (new Date().getHours() - 1) * 3600 * 1000 + 3600 * 1000, // End of the hour
        },
      },
      include: { sensor: true },
    });
    await Promise.all(
      temperatures.map((temp) =>
        this.getRedisClient().LPUSH(
          cacheKey,
          JSON.stringify({ ...temp, timestamp: temp.timestamp.toString() }), // Convert timestamp to string for JSON compatibility),
        ),
      ),
    );
    await this.getRedisClient().expire(cacheKey, 7200); // 2 hour TTL
    return temperatures.map(TemperatureDTO.from);
  }
  public async clearHourlyTemperaturesCache(): Promise<void> {
    const cacheKey = `${this.cacheKey}_${new Date().getHours() - 1}`;
    await this.getRedisClient().del(cacheKey);
  }
}
export const temperatureServices = new TemperatureServices();
