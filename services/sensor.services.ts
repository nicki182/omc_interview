import { SensorDTO } from "@dto";
import PrismaClient from "@prisma_client";
import redis from "@redis";
import {
  CRUDService,
  SensorWithTemperaturesAndMalfunctions,
  NewSensor,
  Sensor,
} from "@types";
class SensorServices
  implements CRUDService<SensorDTO, SensorWithTemperaturesAndMalfunctions>
{
  private prisma = PrismaClient;
  private redis = redis.getClient();
  private cacheKey = "sensor _";
  public async create(data: NewSensor): Promise<SensorDTO> {
    const sensor = await this.prisma.sensor.create({
      data: {
        face: data.face,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    // Cache the created sensor
    await this.redis.set(
      `${this.cacheKey}${sensor.id}`,
      JSON.stringify(sensor),
    );
    return SensorDTO.from(sensor);
  }
  public async list(): Promise<SensorDTO[]> {
    const sensors = await this.prisma.sensor.findMany({});
    return sensors.map(SensorDTO.from);
  }
  public async read(id: number): Promise<SensorDTO | null> {
    const cachedSensor = await this.redis.get(`${this.cacheKey}${id}`);
    if (cachedSensor) {
      return SensorDTO.from(JSON.parse(cachedSensor));
    }
    const sensor = await this.prisma.sensor.findUnique({
      where: { id },
    });
    if (sensor) {
      await this.redis.set(`${this.cacheKey}${id}`, JSON.stringify(sensor));
      return SensorDTO.from(sensor);
    }
    return null;
  }
  public async update(id: number, data: Sensor): Promise<SensorDTO | null> {
    const sensor = await this.prisma.sensor.update({
      where: { id },
      data: {
        face: data.face,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
    // Update the cache
    await this.redis.set(`${this.cacheKey}${id}`, JSON.stringify(sensor));
    return SensorDTO.from(sensor);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.sensor.delete({
      where: { id },
    });
    // Remove from cache
    await this.redis.del(`${this.cacheKey}${id}`);
  }
}
export const sensorServices = new SensorServices();
