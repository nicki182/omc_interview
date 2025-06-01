import { CustomError } from "@error/index";
import { temperaturesToAggregatedTemperaturesMapper } from "@mappers/temperaturesToAggregatedTemperatures.mapper";
import { Time } from "@prisma_client";
import {
  aggregatedTemperatureServices,
  temperatureServices,
} from "@services/index";
import logger from "@utils/logger";
import cron from "node-cron";
const AGGREGATE_TEMPERATURE_JOB = "0 * * * *"; // Every hour
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
