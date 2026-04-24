import redis from "../config/redis.js";

const DEFAULT_TTL_SECONDS = Number.parseInt(process.env.CACHE_TTL_SECONDS || "60", 10);

export const getCache = async (key) => {
  if (!redis) return null;

  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    process.stderr.write(`Cache read failed for ${key}: ${error.message}\n`);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    process.stderr.write(`Cache write failed for ${key}: ${error.message}\n`);
  }
};

export const invalidatePatterns = async (patterns) => {
  if (!redis || !Array.isArray(patterns) || patterns.length === 0) return;

  try {
    for (const pattern of patterns) {
      let cursor = "0";
      do {
        const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
        cursor = nextCursor;
      } while (cursor !== "0");
    }
  } catch (error) {
    process.stderr.write(`Cache invalidation failed: ${error.message}\n`);
  }
};
