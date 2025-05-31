import { CustomError } from "@error/index";
import { AggregatedTemperature, Face, Time } from "@prisma_client";

import { TemperatureDTO } from "./temperature.dto";
export class AggregatedTemperatureDTO {
  private id: number;
  private face: Face;
  private time: Time;
  private temperature_value: number;
  private timestamp: number;

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
  public getTimestamp(): number {
    return this.timestamp;
  }
  public setId(id: number): void {
    this.id = id;
  }
  public aggregateTemperatureFromTemperatures(
    temperatures: TemperatureDTO[],
  ): void {
    if (temperatures.length === 0) {
      throw new CustomError(
        "Cannot aggregate from an empty array of temperatures.",
      );
    }
    this.temperature_value =
      temperatures.reduce((sum, temp) => sum + temp.getTemperatureValue(), 0) /
      temperatures.length; // Calculate average
    this.timestamp = Date.now(); // Set current timestamp for aggregation
  }
  public static from(
    aggregatedTemperature: AggregatedTemperature,
  ): AggregatedTemperatureDTO {
    const dto = new AggregatedTemperatureDTO();
    dto.id = aggregatedTemperature.id;
    dto.face = aggregatedTemperature.face || ({} as Face); // Ensure face is defined
    dto.time = aggregatedTemperature.time || ({} as Time); // Ensure time is defined
    dto.temperature_value = aggregatedTemperature.temperature_value;
    dto.timestamp = aggregatedTemperature.timestamp || Date.now(); // Default to current timestamp if not provided
    return dto;
  }
}
