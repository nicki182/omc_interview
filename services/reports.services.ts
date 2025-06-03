import { ReportDTO } from "@dto";

import { aggregatedTemperatureServices } from "./aggregated_temperature.services";
import { malfunctionServices } from "./malfunction.services";
/*
 * ReportsServices class provides methods to generate reports based on aggregated temperatures and malfunctions.
 * It includes methods to get weekly aggregated temperatures and malfunctions report.
 */
class ReportsServices {
  async getWeeklyReport(): Promise<ReportDTO> {
    const aggregatedTemperaturesOfLastWeek =
      await aggregatedTemperatureServices.getWeeklyAggregatedTemperatures();
    return ReportDTO.from({
      data: aggregatedTemperaturesOfLastWeek,
      description: "Weekly Report",
      name: "Weekly Aggregated Temperatures Report",
    });
  }
  async getMalfunctionsReport(): Promise<ReportDTO> {
    const malfunctions = await malfunctionServices.list();
    return ReportDTO.from({
      data: malfunctions,
      description: "Malfunctions Report",
      name: "Malfunctions Report",
    });
  }
}
const reportsServices = new ReportsServices();
export { reportsServices };
