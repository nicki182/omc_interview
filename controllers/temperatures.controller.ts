import { TemperatureDTO } from "@dto";
import { temperatureServices, sensorServices } from "@services";
import { Reading, Face } from "@types";
import logger from "@utils/logger";
class TemperatureController {
  async addReading(temperature: Reading): Promise<TemperatureDTO> {
    const { face, sensor_id } = temperature;
    logger.info("Received temperature reading:", temperature.temperature_value);

    const existingSensor = await sensorServices.read(sensor_id);

    if (!existingSensor) {
      const newSensor = await sensorServices.create({
        face: face || Face.NORTH, // Default to NORTH if face is not provided
      });
      temperature.sensor_id = newSensor.getId();
    }
    const createdTemperature = await temperatureServices.create(temperature);

    return createdTemperature;
  }
}
export const temperatureController = new TemperatureController();
