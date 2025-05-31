import { Sensor } from "@prisma_client";
import { TemperatureWithSensor } from "@types";
export class TemperatureDTO {
  private timestamp: number;
  private sensor: Sensor;
  private id: number;
  private temperature_value: number;
  private sensor_id: number;
  public getTimestamp(): number {
    return this.timestamp;
  }

  public getSensor(): Sensor {
    return this.sensor;
  }

  public getId(): number {
    return this.id;
  }

  public getTemperatureValue(): number {
    return this.temperature_value;
  }
  public getSensorId(): number {
    return this.sensor_id;
  }

  public aggregateTemperatureFromTemperatures(
    temperatures: TemperatureDTO[],
  ): number {
    return (
      temperatures.reduce((sum, temp) => sum + temp.getTemperatureValue(), 0) /
      temperatures.length
    ); // Calculate average
  }

  public static from(temperature: TemperatureWithSensor): TemperatureDTO {
    const dto = new TemperatureDTO();
    dto.timestamp = temperature.timestamp || Date.now(); // Default to current timestamp if not provided
    dto.id = temperature.id;
    dto.temperature_value = temperature.temperature_value;
    dto.sensor = temperature.sensor || ({} as Sensor); // Ensure sensor is defined
    dto.sensor_id = temperature.sensor?.id || temperature.sensor_id || 0; // Use optional chaining to safely access sensor id
    return dto;
  }
}
