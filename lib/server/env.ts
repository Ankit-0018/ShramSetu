export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(
      `Environment variable ${key} is not defined and no default value was provided.`,
    );
  }
  return value;
};

export const DATABASE_URL = getEnv("DATABASE_URL");

export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const UPSTASH_REDIS_URL = getEnv("UPSTASH_REDIS_URL");

export const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");

export const BULKBLASTER_API_KEY = getEnv("BULKBLASTER_API_KEY");
export const BULKBLASTER_SEND_OTP_URL = getEnv(
  "BULKBLASTER_SEND_OTP_URL",
  "https://bulkblaster-biotp-api-290441563653.asia-south1.run.app/send-otp",
);
