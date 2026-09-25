import { plainToInstance } from 'class-transformer';
import { IsEnum, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}
// TODO: Add the Optional secrets to env
class EnvironmentVariables {
  // App Specific Secrets
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  APP_URL: string;

  // Neon Db Secrets
  @IsString()
  DATABASE_URL: string;

  // Stripe Secrets
  @IsString()
  @IsOptional()
  STRIPE_WEBHOOK_SECRET_LOCAL: string;

  @IsString()
  @IsOptional()
  STRIPE_WEBHOOK_SECRET_PRODUCTION: string;

  @IsString()
  @IsOptional()
  STRIPE_API_SECRET: string;

  // Cloudinary Secrets
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
