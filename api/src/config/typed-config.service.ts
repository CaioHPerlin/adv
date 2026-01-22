import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './environment-variables';

@Injectable()
export class TypedConfigService extends ConfigService<
  EnvironmentVariables,
  true
> {
  get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] {
    return super.get(key, { infer: true });
  }
}
