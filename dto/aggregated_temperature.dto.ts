import { AggregatedTemperature, Face, Time } from "@types";

export class AggregatedTemperatureDTO {
  private id: number;
  private face: Face;
  private time: Time;
  private average_temperature_value: number;
  private timestamp: bigint;

  public getId(): number {
    return this.id;
  }
  public getFace(): Face {
    return this.face;
  }
  public getTime(): Time {
    return this.time;
  }
  public getAverageTemperatureValue(): number {
    return this.average_temperature_value;
  }
  public getTimestamp(): bigint {
    return this.timestamp;
  }
  public setId(id: number): void {
    this.id = id;
  }
  public setFace(face: Face): void {
    this.face = face;
  }
  public setTime(time: Time): void {
    this.time = time;
  }
  public setAverageTemperatureValue(value: number): void {
    this.average_temperature_value = value;
  }
  public setTimestamp(timestamp: bigint): void {
    this.timestamp = timestamp;
  }

  public static from(
    aggregatedTemperature: AggregatedTemperature,
  ): AggregatedTemperatureDTO {
    const dto = new AggregatedTemperatureDTO();
    dto.id = aggregatedTemperature.id;
    dto.face = aggregatedTemperature.face || ({} as Face); // Ensure face is defined
    dto.time = aggregatedTemperature.time || ({} as Time); // Ensure time is defined
    dto.average_temperature_value =
      aggregatedTemperature.average_temperature_value;
    dto.timestamp = (aggregatedTemperature.timestamp || Date.now()) as bigint; // Default to current timestamp if not provided
    return dto;
  }
}
