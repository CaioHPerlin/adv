import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import type { StringValue } from 'node_modules/.pnpm/ms@2.1.3/node_modules/ms';

export class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  @IsNotEmpty()
  NODE_ENV: 'development' | 'production' | 'test';

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRATION_TIME: StringValue | number = '2h';
}

export function validateEnvironmentVariables(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const transformed = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const validationErrors = validateSync(transformed, {
    skipMissingProperties: false,
    forbidUnknownValues: true,
    whitelist: true,
  });

  if (validationErrors.length > 0) {
    throw new Error(
      `Environment validation failed: ${validationErrors.toString()}`,
    );
  }

  return transformed;
}
