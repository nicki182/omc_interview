// import { aggregatedTemperatureServices,temperatureServices } from '@services/index';
// import logger from '@utils/logger';
// import CustomError from '@error/index';
// import cron from 'node-cron';
// const AGGREGATE_TEMPERATURE_JOB = '0 * * * *'; // Every hour
// cron.schedule(AGGREGATE_TEMPERATURE_JOB, async () => {
//   try {
//     logger.info('Running aggregate temperature job');
//     const readings = await temperatureServices.getTemperaturesOfHour();
//     } else {
//       console.log('No aggregated temperatures found');
//     }
//   } catch (error) {
//     console.error('Error running aggregate temperature job:', error);
//   }
// });