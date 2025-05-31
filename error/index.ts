import logger from "@utils/logger";
export class CustomError extends Error {
  constructor(error: string) {
    super(error);
    logger.error(error);
  }
}
