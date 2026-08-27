import "server-only";
import { createClient, type RedisClientType } from "redis";
import { UPSTASH_REDIS_URL } from "./env";

const globalForRedis = globalThis as unknown as {
  redis: RedisClientType | undefined;
};

const isTls = UPSTASH_REDIS_URL.startsWith("rediss://");

export const redis: RedisClientType =
  globalForRedis.redis ??
  (createClient({
    url: UPSTASH_REDIS_URL,
    ...(isTls && {
      socket: {
        tls: true,
        rejectUnauthorized: false,
      },
    }),
  }) as RedisClientType);

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

let connecting: Promise<void> | null = null;

/**
 * Route handlers are stateless — call this before any redis command since
 * there's no persistent server-startup hook in Next.js to connect once.
 */
export const connectRedis = async () => {
  if (redis.isOpen) return;
  if (!connecting) {
    connecting = redis
      .connect()
      .then(() => {
        console.log("Redis Connected");
      })
      .finally(() => {
        connecting = null;
      });
  }
  await connecting;
};
