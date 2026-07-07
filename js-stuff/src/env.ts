import { z } from "zod/v4";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),

  // JWT_ACCESS_SECRET: z.string(),
  // JWT_REFRESH_SECRET: z.string(),
  // JWT_ACCESS_EXPIRES_IN: z.string().default("1d"),
  // JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // STRIPE_PRODUCT_ID: z.string(),
  // STRIPE_SECRET_KEY: z.string(),
  // STRIPE_WEBHOOK_SECRET: z.string(),
});

try {
  // eslint-disable-next-line node/no-process-env
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      "Missing environment variables:",
      error.issues.flatMap((issue) => issue.path),
    );
  } else {
    console.error(error);
  }
  process.exit(1);
}

// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);
