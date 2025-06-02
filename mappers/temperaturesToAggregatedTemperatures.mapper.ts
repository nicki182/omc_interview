import { TemperatureDTO, AggregatedTemperatureDTO } from "@dto";
import { CustomError } from "@error/index";
import { temperatureServices } from "@services";
import { Face, Time } from "@types";
/**
 * Maps a TemperatureDTO[] to AggregatedTemperatureDTO[]
 * @param temperature - The TemperatureDTO[] to map.
 * @returns An Array of AggregatedTemperatureDTO.
 */
export const temperaturesToAggregatedTemperaturesMapper = (
  temperatures: TemperatureDTO[],
  time: Time = Time.HOUR,
): AggregatedTemperatureDTO[] => {
  if (!Array.isArray(temperatures) || temperatures.length === 0) {
    throw new CustomError(
      "Invalid input: Expected an array of TemperatureDTO objects.",
    );
  }
  const faces = Object.values(Face);
  const aggregatedTemperaturesByFace: Record<Face, AggregatedTemperatureDTO> = {
    [Face.NORTH]: new AggregatedTemperatureDTO(),
    [Face.WEST]: new AggregatedTemperatureDTO(),
    [Face.EAST]: new AggregatedTemperatureDTO(),
    [Face.SOUTH]: new AggregatedTemperatureDTO(),
  };
  const temperaturesByFace: Record<Face, TemperatureDTO[]> = {
    [Face.NORTH]: [],
    [Face.WEST]: [],
    [Face.EAST]: [],
    [Face.SOUTH]: [],
  };
  // Group temperatures by face
  temperatures.forEach((reading) => {
    const face = reading.getSensor().getFace();
    if (faces.includes(face)) {
      temperaturesByFace[face].push(reading);
    }
  });
  // Aggregate temperatures for each face
  faces.forEach((face) => {
    if (temperaturesByFace[face].length > 0) {
      const aggregatedTemperatureValue =
        temperatureServices.aggregateTemperatureFromTemperatures(
          temperaturesByFace[face],
        );
      const aggregatedTemperature = aggregatedTemperaturesByFace[face];
      aggregatedTemperature.setFace(face);
      aggregatedTemperature.setTime(time);
      aggregatedTemperature.setTemperatureValue(aggregatedTemperatureValue);
      aggregatedTemperaturesByFace[face] = aggregatedTemperature;
    }
  });
  return Object.values(aggregatedTemperaturesByFace)
    .filter((aggregatedTemperature) => aggregatedTemperature.getFace())
    .map((aggregatedTemperature) => {
      aggregatedTemperature.setTimestamp(Date.now() as unknown as bigint); // Set current timestamp
      return aggregatedTemperature;
    });
};
