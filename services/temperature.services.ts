import PrismaClient, { Temperature } from '@prisma_client';
import redis from '@redis'
import { CRUDService, TemperatureWithSensor } from '@types';
import { TemperatureDTO } from '@dto/temperature.dto';
class TemperatureServices implements CRUDService<TemperatureDTO, TemperatureWithSensor> {
    private prisma = PrismaClient;
    private redis = redis.getClient();
    private cacheKey = 'temperature _';
    public async create(data: Temperature): Promise<TemperatureDTO> {
        const temperature = await this.prisma.temperature.create({
            data: {
                timestamp: data.timestamp,
                sensor_id: data.sensor_id,
                temperature_value: data.temperature_value,
            },
        });
        // Cache the created temperature
        await this.redis.set(`${this.cacheKey}${temperature.id}`, JSON.stringify(temperature));
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
        const cachedTemperature = await this.redis.get(`${this.cacheKey}${id}`);
        if (cachedTemperature) {
            return TemperatureDTO.from(JSON.parse(cachedTemperature));
        }
        const temperature = await this.prisma.temperature.findUnique({
            where: { id },
            include: { sensor: true },
        });
        if (temperature) {
            await this.redis.set(`${this.cacheKey}${id}`, JSON.stringify(temperature));
            return TemperatureDTO.from(temperature);
        }
        return null;
    }
    public async update(id: number, data: TemperatureWithSensor): Promise<TemperatureDTO | null> {
        const temperature = await this.prisma.temperature.update({
            where: { id },
            data: {
                timestamp: data.timestamp,
                sensor_id: data.sensor_id,
                temperature_value: data.temperature_value,
            },
        });
        // Update the cache
        await this.redis.set(`${this.cacheKey}${id}`, JSON.stringify(temperature));
        return TemperatureDTO.from(temperature);
    }

    public async delete(id: number): Promise<void> {
        await this.prisma.temperature.delete({
            where: { id },
        });
        // Remove from cache
        await this.redis.del(`${this.cacheKey}${id}`);
    }

}
export const temperatureServices = new TemperatureServices();