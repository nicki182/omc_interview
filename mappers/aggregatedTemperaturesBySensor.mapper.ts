import { TemperatureDTO, SensorDTO } from "@dto";
/**}
 * Aggregates temperatures by sensor.
 * @param {TemperatureDTO[]} temperatures - Array of temperature data transfer objects.
 * @return {Array<{ sensor: SensorDTO; aggregatedTemperature: number }>} - Array of objects containing sensor and aggregated temperature.
 */
export const aggregatedTemperaturesBySensorMapper = (
  temperatures: TemperatureDTO[],
): { sensor: SensorDTO; aggregatedTemperature: number }[] => {
  const temperaturesBySensor: { sensor: SensorDTO; temperatures: number[] }[] =
    [];
  temperatures.forEach((temperature) => {
    const existingSensor = temperaturesBySensor.find(
      (item) => item.sensor.getId() === temperature.getSensorId(),
    );
    const sensorDTO = temperature.getSensor();
    temperaturesBySensor.push({
      sensor: sensorDTO,
      temperatures: (existingSensor?.temperatures || []).concat(
        temperature.getTemperatureValue(),
      ),
    });
  });

  return temperaturesBySensor.map((item) => {
    const aggregatedTemperature =
      item.temperatures.reduce((acc, temp) => acc + temp, 0) /
      item.temperatures.length;
    return {
      sensor: item.sensor,
      aggregatedTemperature: aggregatedTemperature,
    };
  });
};
