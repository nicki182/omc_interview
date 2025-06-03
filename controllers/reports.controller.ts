import { AggregatedTemperatureDTO, MalfunctionDTO } from "@dto";
import ServerError from "@error/server.error";
import { reportsServices } from "@services";
class ReportController {
  /**
   * Generates a weekly report of aggregated temperatures.
   * @returns {Promise<AggregatedTemperature[]>} - A promise that resolves to an array of aggregated temperatures.
   * * @throws {ServerError} - If there is an error generating the report.
   * */
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
  /**
   * Retrieves a report of malfunctions.
   * @returns {Promise<Malfunction[]>} - A promise that resolves to an array of malfunctions.
   * @throws {ServerError} - If there is an error retrieving the malfunctions.
   */
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
