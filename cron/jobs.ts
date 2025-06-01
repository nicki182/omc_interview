import { CustomError } from "@error/index";
import {
  temperaturesToAggregatedTemperaturesMapper,
  aggregatedTemperaturesBySensorMapper,
} from "@mappers";
import {
  aggregatedTemperatureServices,
  malfunctionServices,
  temperatureServices,
} from "@services";
import { NewMalfunction, Time } from "@types";
import logger from "@utils/logger";
import cron from "node-cron";
const AGGREGATE_TEMPERATURE_JOB = "0 * * * *"; // Every hour
const CHECK_MALFUNCTIONS_JOB = "0 * * * *"; // Every hour
// This cron job runs every hour to aggregate temperatures
cron.schedule(AGGREGATE_TEMPERATURE_JOB, async () => {
  try {
    logger.info("Running aggregate temperature job");
    const readings = await temperatureServices.getTemperaturesOfHour();
    if (readings.length > 0) {
      const aggregatedTemperatures = temperaturesToAggregatedTemperaturesMapper(
        readings,
        Time.HOUR,
      );
      await Promise.all(
        aggregatedTemperatures.map((aggregatedTemperature) => {
          return aggregatedTemperatureServices.create({
            face: aggregatedTemperature.getFace(),
            time: aggregatedTemperature.getTime(),
            temperature_value: aggregatedTemperature.getTemperatureValue(),
            timestamp: aggregatedTemperature.getTimestamp(),
          });
        }),
      );
      await temperatureServices.clearHourlyTemperaturesCache();
      logger.info(
        `Hourly aggregated temperatures created: ${aggregatedTemperatures.length}`,
      );
    }
  } catch (error) {
    throw new CustomError("Error in aggregate temperature job: " + error);
  }
});
cron.schedule(CHECK_MALFUNCTIONS_JOB, async () => {
  try {
    logger.info("Running check malfunction job");
    const readings = await temperatureServices.getTemperaturesOfHour();
    if (readings.length === 0) {
      logger.info("No temperature readings found for the hour.");
      return;
    }
    // Check for malfunctions based on the aggregated temperatures
    const aggregatedTemperatures = temperaturesToAggregatedTemperaturesMapper(
      readings,
      Time.HOUR,
    );
    const aggregatedTemperaturesBySensor =
      aggregatedTemperaturesBySensorMapper(readings);
    const malfunctions: NewMalfunction[] = [];
    aggregatedTemperaturesBySensor.forEach((aggregatedTemperature) => {
      aggregatedTemperatures.forEach((temp) => {
        if (
          malfunctionServices.isDeviationExceeded(
            aggregatedTemperature.aggregatedTemperature,
            temp.getTemperatureValue(),
          )
        ) {
          const deviationPercentage = malfunctionServices.calculateDeviation(
            aggregatedTemperature.aggregatedTemperature,
            temp.getTemperatureValue(),
          );
          malfunctions.push({
            sensor_id: aggregatedTemperature.sensor.getId(),
            timestamp: temp.getTimestamp(),
            temperature_value: aggregatedTemperature.aggregatedTemperature,
            deviation: deviationPercentage,
          });
        }
      });
    });
    if (malfunctions.length > 0) {
      await Promise.all(
        malfunctions.map((malfunction) => {
          logger.warn(
            `Malfunction detected: Sensor ID ${malfunction.sensor_id}, ` +
              `Temperature Value ${malfunction.temperature_value}, ` +
              `Deviation ${malfunction.deviation}%`,
          );
          malfunctionServices.create(malfunction);
        }),
      );
      logger.info(`Malfunctions detected and created: ${malfunctions.length}`);
      return;
    }
    logger.info("No malfunctions detected for the hour.");
  } catch (error) {
    throw new CustomError("Error in check malfunction job: " + error);
  }
});
