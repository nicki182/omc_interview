import { temperatureController, reportController  } from "@controllers";
import { createValidationMiddleware } from "@middlewares";
import { readingSchema } from "@schemas";
import {  Reading, Face } from "@types";
import  logger  from "@utils/logger";
import express from "express";

const router = express.Router();
router.post("/add",createValidationMiddleware(readingSchema) ,async (req, res) => {
  const { timestamp, face, temperature_value, sensor_id } = req.body;
  try {
    const newTemperature:Reading = {
      timestamp,
      face: face || Face.NORTH, // Default to NORTH if face is not provided
      temperature_value,
      sensor_id
    };
    const createdTemperature = await temperatureController.addReading(newTemperature);
    res.status(201).json({ message: "Temperature reading added successfully", data: createdTemperature });                          
  } catch (error) {
    logger.error("Error adding temperature reading:", error);
    res.status(500).json({ message: "Error adding temperature reading", error: error.message });
  }                            
});
router.get("/weekly_report", async (req, res) => {
    try {
        const report = await reportController.getWeeklyReportAggregatedValues();
        res.status(200).json({ message: "Weekly report generated", data: report });
    } catch (error) {
        logger.error("Error generating weekly report:", error);
        res.status(500).json({ message: "Error generating weekly report", error: error.message });
    }
    })
router.get("/malfunctions_report", async (req, res) => {
    try {
        const report = await reportController.getReportMalfunctions();
        res.status(200).json({ message: "Malfunctions report generated", data: report });
    } catch (error) {
        logger.error("Error generating malfunctions report:", error);
        res.status(500).json({ message: "Error generating malfunctions report", error: error.message });
    }
})

export default router as express.Router;                                    