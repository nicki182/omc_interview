import { Sensor, Face } from "../generated/prisma";
import { sensorServices } from "../services";
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
test("should create new sensor ", async () => {
  const sensor = {
    id: 1,
    face: Face.NORTH,
    createdAt: new Date(),
    malfunctions: undefined, // Assuming malfunctions is optional
    temperatures: undefined, // Assuming aggregatedTemperatures is optional
  };
  prismaMock.sensor.create.mockResolvedValue(sensor);
  const result = await sensorServices.create(sensor);
  await expect({ ...result }).toEqual(sensor);
});
test("should list all sensors", async () => {
  const sensors: Sensor[] = [
    {
      id: 1,
      face: Face.NORTH,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      face: Face.SOUTH,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  prismaMock.sensor.findMany.mockResolvedValue(sensors);
  const result = await sensorServices.list();

  expect(result).toHaveLength(2);
  expect(result[0].getId()).toEqual(1);
  expect(result[1].getId()).toEqual(2);
});
test("should read an sensor by id", async () => {
  const sensor: Sensor = {
    id: 1,
    face: Face.NORTH,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  prismaMock.sensor.findUnique.mockResolvedValue(sensor);
  const result = await sensorServices.read(1);

  expect(result).toBeDefined();
  expect(result?.getId()).toEqual(1);
});
test("should return null for non-existing sensor", async () => {
  prismaMock.sensor.findUnique.mockResolvedValue(null);
  const result = await sensorServices.read(999);

  expect(result).toBeNull();
});
