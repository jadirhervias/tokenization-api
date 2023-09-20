import { randomUUID, UUID } from 'crypto';

export class Uuid {
  readonly value: UUID;

  constructor(value: UUID) {
    this.value = value;
  }

  static random(): Uuid {
    return new Uuid(randomUUID());
  }

  toString(): string {
    return this.value as string;
  }
}