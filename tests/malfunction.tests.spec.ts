import { malfunctionServices } from "../services";
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
test("should create new malfunction ", async () => {
  const malfunction = {
    id: 1,
    sensor_id: 1,
    deviation: 5,
    timestamp: BigInt(Date.now()),
    average_temperature_value: 25,
    sensor: {
      id: 1,
      face: "NORTH", // Assuming Face is a string enum
      createdAt: new Date(),
      malfunctions: undefined, // Assuming malfunctions is optional
      temperatures: undefined, // Assuming aggregatedTemperatures is optional
    },
  };
  prismaMock.malfunction.create.mockResolvedValue(malfunction);
  const result = await malfunctionServices.create(malfunction);
  // Convert BigInt to Number for comparison
  const expected = {
    ...malfunction,
    timestamp: Number(malfunction.timestamp),
  };

  const actual = {
    ...result,
    timestamp: Number(result.getTimestamp()),
  };

  expect(actual).toEqual(expected);
});
test("should list all malfunctions", async () => {
  const malfunctions = [
    {
      id: 1,
      sensor_id: 1,
      deviation: 5,
      timestamp: BigInt(Date.now()),
      average_temperature_value: 25,
      sensor: {
        id: 1,
        face: "NORTH", // Assuming Face is a string enum
        createdAt: new Date(),
      },
    },
    {
      id: 2,
      sensor_id: 2,
      deviation: 10,
      timestamp: BigInt(Date.now()),
      average_temperature_value: 30,
      sensor: {
        id: 2,
        face: "SOUTH", // Assuming Face is a string enum
        createdAt: new Date(),
      },
    },
  ];

  prismaMock.malfunction.findMany.mockResolvedValue(malfunctions);
  const result = await malfunctionServices.list();

  expect(result).toHaveLength(2);
  expect(result[0].getId()).toEqual(1);
  expect(result[1].getId()).toEqual(2);
});
test("should read an malfunctions by id", async () => {
  const malfunction = {
    id: 1,
    sensor_id: 1,
    deviation: 5,
    timestamp: BigInt(Date.now()),
    average_temperature_value: 25,
    sensor: {
      id: 1,
      face: "NORTH", // Assuming Face is a string enum
      createdAt: new Date(),
      malfunctions: undefined, // Assuming malfunctions is optional
      temperatures: undefined, // Assuming aggregatedTemperatures is optional
    },
  };
  prismaMock.malfunction.findUnique.mockResolvedValue(malfunction);
  const result = await malfunctionServices.read(1);

  expect(result).toBeDefined();
  expect(result?.getId()).toEqual(1);
});
test("should return null for non-existing malfunction", async () => {
  prismaMock.malfunction.findUnique.mockResolvedValue(null);
  const result = await malfunctionServices.read(999);

  expect(result).toBeNull();
});
