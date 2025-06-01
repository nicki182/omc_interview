import { MalfunctionWithSensor } from "@types";

import { SensorDTO } from "./sensor.dto";
export class MalfunctionDTO {
  private id: number;
  private sensor_id: number;
  private timestamp: number;
  private temperature_value: number;
  private deviation: number;
  private sensor: SensorDTO;

  public getId(): number {
    return this.id;
  }

  public getSensorId(): number {
    return this.sensor_id;
  }

  public getTimestamp(): number {
    return this.timestamp;
  }

  public getTemperature(): number {
    return this.temperature_value;
  }
  public getDeviation(): number {
    return this.deviation;
  }

  public getSensor(): SensorDTO {
    return this.sensor;
  }

  public static from(malfunction: MalfunctionWithSensor): MalfunctionDTO {
    const dto = new MalfunctionDTO();
    dto.id = malfunction.id;
    dto.sensor_id = malfunction.sensor_id || malfunction.sensor?.id || 0; // Ensure sensor_id is defined
    dto.timestamp = malfunction.timestamp || Date.now(); // Default to current timestamp if not provided
    dto.temperature_value = malfunction.temperature_value;
    dto.deviation = malfunction.deviation;
    dto.sensor = malfunction.sensor
      ? SensorDTO.from(malfunction.sensor)
      : new SensorDTO(); // Ensure sensor is defined
    return dto;
  }
}
