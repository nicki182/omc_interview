import { CustomError } from "@error/index";
import logger from "@utils/logger";
import { createClient, RedisClientType } from "redis";
class RedisClient {
  private client!: RedisClientType;
  getClient() {
    return this.client;
  }
  public async start(): Promise<void> {
    try {
      const client: RedisClientType = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
      });
      client.on("error", (err) => {
        logger.error("Redis error:", err.message);
        setTimeout(this.start, 5000); // retry every 5s
      });

      client.on("ready", () => {
        logger.info("Connected to Redis!");
      });
      await client.connect();
      this.client = client;
    } catch (e) {
      throw new CustomError(e as string);
    }
  }
  public async stop(): Promise<void> {
    await this.client.quit();
  }
}
export default new RedisClient();
