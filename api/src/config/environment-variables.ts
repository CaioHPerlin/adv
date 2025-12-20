import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  @IsNotEmpty()
  NODE_ENV: 'development' | 'production' | 'test';

  @IsInt()
  @IsOptional()
  PORT: number = 5000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
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
