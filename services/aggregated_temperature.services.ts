import { AggregatedTemperatureDTO } from "@dto/index";
import PrismaClient, { AggregatedTemperature } from "@prisma_client";
import redis from "@redis";
import { CRUDService } from "@types";
import logger from "@utils/logger";
class AggregatedTemperatureServices
  implements CRUDService<AggregatedTemperatureDTO, AggregatedTemperature>
{
  private prisma = PrismaClient;
  private redis = redis.getClient();
  private cacheKey = "aggregated_temperature _";
  public async create(
    data: Omit<AggregatedTemperature, "id">,
  ): Promise<AggregatedTemperatureDTO> {
    const aggregatedTemperature =
      await this.prisma.aggregatedTemperature.create({ data });
    // Cache the created aggregatedTemperature
    await this.redis.set(
      `${this.cacheKey}${aggregatedTemperature.id}`,
      JSON.stringify(aggregatedTemperature),
    );
    logger.info(
      `Aggregated Temperature created with ID: ${aggregatedTemperature.id}`,
    );
    return AggregatedTemperatureDTO.from(aggregatedTemperature);
  }
  public async list(): Promise<AggregatedTemperatureDTO[]> {
    const aggregatedTemperatures =
      await this.prisma.aggregatedTemperature.findMany({});
    logger.info(
      `Retrieved ${aggregatedTemperatures.length} aggregatedTemperatures from the database`,
    );
    return aggregatedTemperatures.map(AggregatedTemperatureDTO.from);
  }
  public async read(id: number): Promise<AggregatedTemperatureDTO | null> {
    const cachedAggregatedTemperature = await this.redis.get(
      `${this.cacheKey}${id}`,
    );
    if (cachedAggregatedTemperature) {
      return AggregatedTemperatureDTO.from(
        JSON.parse(cachedAggregatedTemperature),
      );
    }
    const aggregatedTemperature =
      await this.prisma.aggregatedTemperature.findUnique({
        where: { id },
      });
    if (aggregatedTemperature) {
      await this.redis.set(
        `${this.cacheKey}${id}`,
        JSON.stringify(aggregatedTemperature),
      );
      logger.info(
        `AggregatedTemperature with ID: ${id} retrieved from the database`,
      );
      return AggregatedTemperatureDTO.from(aggregatedTemperature);
    }
    return null;
  }
  public async update(
    id: number,
    data: AggregatedTemperature,
  ): Promise<AggregatedTemperatureDTO | null> {
    const aggregatedTemperature =
      await this.prisma.aggregatedTemperature.update({
        where: { id },
        data,
      });
    // Update the cache
    await this.redis.set(
      `${this.cacheKey}${id}`,
      JSON.stringify(aggregatedTemperature),
    );
    logger.info(`AggregatedTemperature with ID: ${id} updated`);
    return AggregatedTemperatureDTO.from(aggregatedTemperature);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.aggregatedTemperature.delete({
      where: { id },
    });
    // Remove from cache
    await this.redis.del(`${this.cacheKey}${id}`);
    logger.info(`AggregatedTemperature with ID: ${id} deleted`);
  }
}
export const aggregatedTemperatureServices =
  new AggregatedTemperatureServices();
