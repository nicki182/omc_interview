import redis from "@redis";
import router from "@routes";
import cors from "cors";
import express from "express";
import expressWinston from "express-winston";
import { transports } from "winston";
import "@cron";
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  expressWinston.logger({
    transports: [new transports.Console()],
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  }),
);
app.use('/api/v1/reading',router);
(async () => {
  try {
    await redis.start(); // ensure it's ready before importing anything that uses it
    console.log("Redis started successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Redis failed to start", error);
    process.exit(1);
  }
})();

