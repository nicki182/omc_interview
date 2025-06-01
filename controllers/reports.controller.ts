import ServerError from "@error/server.error";
import { reportsServices } from "@services";
class ReportController {
  async getWeeklyReportAggregatedValues() {
    try {
      const report = await reportsServices.getWeeklyReport();
      return report;
    } catch (error) {
      throw new ServerError({
        message: "Error generating weekly report" + error,
      });
    }
  }

  async getReportMalfunctions() {
    try {
      const report = await reportsServices.getMalfunctionsReport();
      return report;
    } catch (error) {
      throw new ServerError({
        message: "Error retrieving malfunctions: " + error,
      });
    }
  }
}
export const reportController = new ReportController();
