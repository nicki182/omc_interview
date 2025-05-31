import { Face } from "@prisma_client";
import { SensorWithTemperaturesAndMalfunctions } from "@types";
export class SensorDTO {
  private id: number;
  private createdAt: Date;
  private face: Face;
  private temperatures: SensorWithTemperaturesAndMalfunctions["temperatures"];
  private malfunctions: SensorWithTemperaturesAndMalfunctions["malfunctions"];
  public getId(): number {
    return this.id;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getFace(): Face {
    return this.face;
  }
  public setId(id: number): void {
    this.id = id;
  }
  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }
  public setFace(face: Face): void {
    this.face = face;
  }
  public getTemperatures(): SensorWithTemperaturesAndMalfunctions["temperatures"] {
    return this.temperatures;
  }
  public getMalfunctions(): SensorWithTemperaturesAndMalfunctions["malfunctions"] {
    return this.malfunctions;
  }

  public static from(sensor: SensorWithTemperaturesAndMalfunctions): SensorDTO {
    const dto = new SensorDTO();
    dto.id = sensor.id;
    dto.createdAt = sensor.createdAt || new Date(); // Default to current date if not provided
    dto.face = sensor.face;
    dto.temperatures = sensor.temperatures || [];
    dto.malfunctions = sensor.malfunctions || [];
    return dto;
  }
}
