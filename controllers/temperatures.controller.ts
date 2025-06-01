import { TemperatureDTO } from "@dto/temperature.dto";
import { Face } from "@prisma_client";
import { temperatureServices, sensorServices } from "@services/index";
import { Reading } from "@types";
import logger from "@utils/logger";
export class TemperatureController {
  async addReading(temperature: Reading): Promise<TemperatureDTO> {
    const { face, sensor_id } = temperature;

    logger.info("Received temperature reading:", temperature);

    if (!sensor_id) {
      const newSensor = await sensorServices.create({
        face: face || Face.NORTH, // Default to NORTH if face is not provided
      });
      temperature.sensor_id = newSensor.getId();
    }

    const createdTemperature = await temperatureServices.create(temperature);

    return createdTemperature;
  }
  // async checkMalfunction(temperature:Reading): Promise<boolean> {
  //     const malfunction = await temperatureServices.checkMalfunction();
  //     if (malfunction) {
  //         logger.warn("Temperature sensor malfunction detected.");
  //         return true;
  //     }
  //     logger.info("No temperature sensor malfunctions detected.");
  //     return false;
  // }
}
