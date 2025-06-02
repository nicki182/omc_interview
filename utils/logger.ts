import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const { combine, timestamp, printf, colorize } = format;
const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});
const logger = createLogger({
  format: combine(timestamp(), loggerFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), loggerFormat),
    }),
    new DailyRotateFile({
      filename: "./log/%DATE%-combined-logs.log",
    }),
    new DailyRotateFile({
      filename: "./log/%DATE%-error-logs.log",
      level: "error",
    }),
    new DailyRotateFile({
      filename: "./log/%DATE%-warn-logs.log",
      level: "warn",
    }),
    new DailyRotateFile({
      filename: "./log/%DATE%-info-logs.log",
      level: "info",
    }),
  ],
});

export const malfunctionLogger = createLogger({
  format: combine(timestamp(), loggerFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), loggerFormat),
    }),
    new DailyRotateFile({
      filename: "./log/%DATE%-malfunction-logs.log",
      level: "warn",
    }),
  ],
});

export default logger;
