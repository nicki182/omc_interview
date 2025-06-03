import { TemperatureDTO } from "@dto";
import { temperatureServices, sensorServices } from "@services";
import { Reading, Face, TemperaturePayload } from "@types";
import logger from "@utils/logger";
class TemperatureController {
  /**
   * Adds a new temperature reading.
   * @param temperature - The temperature reading to add.
   * @returns The created temperature object with its ID and timestamp.
   */
  async addReading(temperature: Reading): Promise<TemperaturePayload> {
    const { face, sensor_id } = temperature;
    logger.info("Received temperature reading:", temperature.temperature_value);

    const existingSensor = await sensorServices.read(sensor_id);

    if (!existingSensor) {
      const newSensor = await sensorServices.create({
        face: face || Face.NORTH, // Default to NORTH if face is not provided
      });
      temperature.sensor_id = newSensor.getId();
    }
    const createdTemperature: TemperatureDTO =
      await temperatureServices.create(temperature);
    const temperatureObject = {
      ...createdTemperature,
      timestamp: createdTemperature.getTimestamp().toString(), // Convert bigint to string for JSON serialization
    } as TemperaturePayload;
    return temperatureObject;
  }
}
export const temperatureController = new TemperatureController();
