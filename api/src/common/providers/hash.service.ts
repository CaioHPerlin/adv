import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  private readonly function = argon2;

  async hash(plain: string): Promise<string> {
    return await this.function.hash(plain);
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    return await this.function.verify(hash, plain);
  }
}
