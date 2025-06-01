import { Face } from "@prisma_client";
import { temperatureServices, sensorServices, reportsServices } from "@services/index";
import { NewTemperature } from "@types";
import  logger  from "@utils/logger";
import express from "express";
const router = express.Router();
router.post("/reading/add", async (req, res) => {
  const { timestamp, face, temperature_value, sensor_id } = req.body;
  const temperature:NewTemperature = {
    timestamp: timestamp || Date.now(), // Default to current timestamp if not provided
    temperature_value: temperature_value || 0, // Default to 0 if temperature_value is not provided
    sensor_id: sensor_id, // Default to 0 if sensor_id is not provided
  };     
  logger.info("Received temperature reading:", temperature);
  if (!sensor_id) {
    const newSensor = await sensorServices.create({
        face: face as Face || Face.NORTH, // Ensure face is a valid Face enum value
        });
    temperature.sensor_id = newSensor.getId(); // Assign the new sensor's ID to the temperature reading
  }
  const createdTemperature = await temperatureServices.create(temperature); 
  // Here you would typically process the temperature data
  // For example, save it to a database or perform some calculations
  res
    .status(200)
    .json({ message: "Temperature reading received", data: createdTemperature });                            
});
router.get("/reading/weekly_report", async (req, res) => {
    const { face, startDate, endDate } = req.body;
    try {
        const report = await reportsServices.getWeeklyReport(face, startDate, endDate);
        res.status(200).json({ message: "Weekly report generated", data: report });
    } catch (error) {
        logger.error("Error generating weekly report:", error);
        res.status(500).json({ message: "Error generating weekly report", error: error.message });
    }
    })
router.get("/reading/malfunctions_report", async (req, res) => {
    try {
        const report = await reportsServices.getMalfunctionsReport();
        res.status(200).json({ message: "Malfunctions report generated", data: report });
    } catch (error) {
        logger.error("Error generating malfunctions report:", error);
        res.status(500).json({ message: "Error generating malfunctions report", error: error.message });
    }
})