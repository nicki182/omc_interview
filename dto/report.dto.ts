import { Report, ReportData } from "@types";
export class ReportDTO {
  private name: string;
  private description: string;
  private data: ReportData;

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }                                                                                                         

  public getData(): ReportData {                                                                                                                                                                                    
    return this.data;
  }

  public static from(report: Report): ReportDTO {
    const dto = new ReportDTO();
    dto.name = report.name;
    dto.description = report.description;
    dto.data = report.data;
    return dto;
  }
}
