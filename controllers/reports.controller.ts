import { AggregatedTemperatureDTO, MalfunctionDTO } from "@dto";
import ServerError from "@error/server.error";
import { reportsServices } from "@services";
class ReportController {
  async getWeeklyReportAggregatedValues() {
    try {
      const report = await reportsServices.getWeeklyReport();
      const reportToObject = {
        ...report,
        data: ((report.getData() as AggregatedTemperatureDTO[]) || []).map(
          (item) => ({
            ...item,
            timestamp: item.getTimestamp().toString(), // Convert bigint to string for JSON serialization
          }),
        ),
      };
      return reportToObject;
    } catch (error) {
      throw new ServerError({
        message: "Error generating weekly report" + error,
      });
    }
  }

  async getReportMalfunctions() {
    try {
      const report = await reportsServices.getMalfunctionsReport();
      const reportToObject = {
        ...report,
        data: ((report.getData() as MalfunctionDTO[]) || []).map((item) => ({
          ...item,
          timestamp: item.getTimestamp().toString(), // Convert bigint to string for JSON serialization
        })),
      };
      return reportToObject;
    } catch (error) {
      throw new ServerError({
        message: "Error retrieving malfunctions: " + error,
      });
    }
  }
}
export const reportController = new ReportController();
