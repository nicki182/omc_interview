import { temperatureController, reportController } from "@controllers";
import { createValidationMiddleware } from "@middlewares";
import { readingSchema } from "@schemas";
import { Reading, Face } from "@types";
import logger from "@utils/logger";
import express from "express";

const router = express.Router();

/**
 * @openapi
 * /api/v1/reading/add:
 *   post:
 *     summary: Add a new temperature reading
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               face:
 *                 type: string
 *                 enum: [NORTH, EAST, SOUTH, WEST]
 *               temperature_value:
 *                 type: number
 *               sensor_id:
 *                 type: string
 *             required:
 *               - timestamp
 *               - temperature_value
 *               - sensor_id
 *     responses:
 *       201:
 *         description: Temperature reading added successfully
 *       500:
 *         description: Error adding temperature reading
 */
router.post("/add", createValidationMiddleware(readingSchema), async (req, res) => {
  const { timestamp, face, temperature_value, sensor_id } = req.body;
  try {
    const newTemperature: Reading = {
      timestamp,
      face: face || Face.NORTH,
      temperature_value,
      sensor_id,
    };
    const createdTemperature = await temperatureController.addReading(newTemperature);
    res.status(201).json({ message: "Temperature reading added successfully", data: createdTemperature });
  } catch (error) {
    logger.error("Error adding temperature reading:", error);
    res.status(500).json({ message: "Error adding temperature reading", error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/reading/weekly_report:
 *   get:
 *     summary: Get weekly aggregated temperature report
 *     responses:
 *       200:
 *         description: Weekly report generated
 *       500:
 *         description: Error generating weekly report
 */
router.get("/weekly_report", async (req, res) => {
  try {
    const report = await reportController.getWeeklyReportAggregatedValues();
    res.status(200).json({ message: "Weekly report generated", data: report });
  } catch (error) {
    logger.error("Error generating weekly report:", error);
    res.status(500).json({ message: "Error generating weekly report", error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/reading/malfunctions_report:
 *   get:
 *     summary: Get report of sensor malfunctions
 *     responses:
 *       200:
 *         description: Malfunctions report generated
 *       500:
 *         description: Error generating malfunctions report
 */
router.get("/malfunctions_report", async (req, res) => {
  try {
    const report = await reportController.getReportMalfunctions();
    res.status(200).json({ message: "Malfunctions report generated", data: report });
  } catch (error) {
    logger.error("Error generating malfunctions report:", error);
    res.status(500).json({ message: "Error generating malfunctions report", error: error.message });
  }
});

export default router as express.Router;
