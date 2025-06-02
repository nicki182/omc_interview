import { SensorDTO } from "@dto";
import { TemperatureWithSensor } from "@types";
export class TemperatureDTO {
  private timestamp: bigint;
  private sensor: SensorDTO;
  private id: number;
  private temperature_value: number;
  private sensor_id: number;
  public getTimestamp(): bigint {
    return this.timestamp;
  }

  public getSensor(): SensorDTO {
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

  public static from(temperature: TemperatureWithSensor): TemperatureDTO {
    const dto = new TemperatureDTO();
    dto.timestamp = (temperature.timestamp || Date.now()) as bigint; // Default to current timestamp if not provided
    dto.id = temperature.id;
    dto.temperature_value = temperature.temperature_value;
    dto.sensor = temperature.sensor
      ? SensorDTO.from(temperature.sensor)
      : new SensorDTO(); // Ensure sensor is defined
    dto.sensor_id = temperature.sensor?.id || temperature.sensor_id || 0; // Use optional chaining to safely access sensor id
    return dto;
  }
}
