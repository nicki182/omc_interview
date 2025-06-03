import { AggregatedTemperature, Face } from "../generated/prisma";
import { aggregatedTemperatureServices } from "../services";
import { prismaMock } from "./singleton";
jest.mock("@redis", () => ({
  __esModule: true,
  default: {
    start: jest.fn(),
    stop: jest.fn(),
    getClient: jest.fn(() => ({
      set: jest.fn(),
      get: jest.fn(),
      quit: jest.fn(),
    })),
  },
}));
test("should create new aggregated temperature ", async () => {
  const aggregatedTemperature: AggregatedTemperature = {
    id: 1,
    timestamp: BigInt(Date.now()),
    face: Face.NORTH,
    average_temperature_value: 25,
    time: "HOUR",
  };
  prismaMock.aggregatedTemperature.create.mockResolvedValue(
    aggregatedTemperature,
  );
  const result = await aggregatedTemperatureServices.create(
    aggregatedTemperature,
  );

  await expect({ ...result }).toEqual(aggregatedTemperature);
});
test("should list all aggregated temperatures", async () => {
  const aggregatedTemperatures: AggregatedTemperature[] = [
    {
      id: 1,
      timestamp: BigInt(Date.now()),
      face: Face.NORTH,
      average_temperature_value: 25,
      time: "HOUR",
    },
    {
      id: 2,
      timestamp: BigInt(Date.now()),
      face: Face.SOUTH,
      average_temperature_value: 30,
      time: "HOUR",
    },
  ];
  prismaMock.aggregatedTemperature.findMany.mockResolvedValue(
    aggregatedTemperatures,
  );
  const result = await aggregatedTemperatureServices.list();

  expect(result).toHaveLength(2);
  expect(result[0].getId()).toEqual(1);
  expect(result[1].getId()).toEqual(2);
});
test("should read an aggregated temperature by id", async () => {
  const aggregatedTemperature: AggregatedTemperature = {
    id: 1,
    timestamp: BigInt(Date.now()),
    face: Face.NORTH,
    average_temperature_value: 25,
    time: "HOUR",
  };
  prismaMock.aggregatedTemperature.findUnique.mockResolvedValue(
    aggregatedTemperature,
  );
  const result = await aggregatedTemperatureServices.read(1);

  expect(result).toBeDefined();
  expect(result?.getId()).toEqual(1);
});
test("should return null for non-existing aggregated temperature", async () => {
  prismaMock.aggregatedTemperature.findUnique.mockResolvedValue(null);
  const result = await aggregatedTemperatureServices.read(999);

  expect(result).toBeNull();
});
