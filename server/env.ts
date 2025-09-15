import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("5000"),
  DATABASE_URL: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  // Add other environment variables as needed
});

export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  }
}

export type Env = z.infer<typeof envSchema>;