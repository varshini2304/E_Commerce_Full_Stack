import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
let redis = null;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  redis.on("connect", () => {
    process.stdout.write("Redis connected\n");
  });

  redis.on("error", (error) => {
    process.stderr.write(`Redis error: ${error.message}\n`);
  });

  redis.connect().catch((error) => {
    process.stderr.write(`Redis connection failed: ${error.message}\n`);
  });
}

export default redis;
