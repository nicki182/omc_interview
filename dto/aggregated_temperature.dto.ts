import { AggregatedTemperature, Face, Time } from "@types";

export class AggregatedTemperatureDTO {
  private id: number;
  private face: Face;
  private time: Time;
  private temperature_value: number;
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
  public getTemperatureValue(): number {
    return this.temperature_value;
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
  public setTemperatureValue(value: number): void {
    this.temperature_value = value;
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
    dto.temperature_value = aggregatedTemperature.temperature_value;
    dto.timestamp = (aggregatedTemperature.timestamp || Date.now()) as bigint; // Default to current timestamp if not provided
    return dto;
  }
}
