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
import logger, { malfunctionLogger } from "@utils/logger";
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
            average_temperature_value:
              aggregatedTemperature.getAverageTemperatureValue(),
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
    logger.error("Error in aggregate temperature job: " + error);
  }
});
// This cron job runs every hour to check for malfunctions
cron.schedule(CHECK_MALFUNCTIONS_JOB, async () => {
  try {
    logger.info("Running check malfunction job");
    const readings = await temperatureServices.getTemperaturesOfHour();
    if (readings.length === 0) {
      logger.info("No temperature readings found for the hour.");
      return;
    }
    // Map based on the aggregated temperatures
    const aggregatedTemperatures = temperaturesToAggregatedTemperaturesMapper(
      readings,
      Time.HOUR,
    );
    // Map based on the aggregated temperatures by sensor
    const aggregatedTemperaturesBySensor =
      aggregatedTemperaturesBySensorMapper(readings);
    const malfunctions: NewMalfunction[] = [];
    aggregatedTemperaturesBySensor.forEach((aggregatedTemperature) => {
      aggregatedTemperatures.forEach((temp) => {
        // Check if the aggregated temperature exceeds the deviation threshold
        if (
          malfunctionServices.isDeviationExceeded(
            aggregatedTemperature.aggregatedTemperature,
            temp.getAverageTemperatureValue(),
          )
        ) {
          const deviationPercentage = malfunctionServices.calculateDeviation(
            aggregatedTemperature.aggregatedTemperature,
            temp.getAverageTemperatureValue(),
          );
          malfunctions.push({
            sensor_id: aggregatedTemperature.sensor.getId(),
            timestamp: temp.getTimestamp(),
            average_temperature_value:
              aggregatedTemperature.aggregatedTemperature,
            deviation: deviationPercentage,
          });
        }
      });
    });
    if (malfunctions.length > 0) {
      await Promise.all(
        malfunctions.map((malfunction) => {
          malfunctionLogger.warn(
            `Malfunction detected: Sensor ID ${malfunction.sensor_id}, ` +
              `Temperature Value ${malfunction.average_temperature_value}, ` +
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
    logger.error("Error in check malfunction job: " + error);
  }
});
// Graceful shutdown handling
process.on("SIGINT", () => {
  logger.info("Shutting down cron jobs...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
