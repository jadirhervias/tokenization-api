import crypto from 'crypto';
import { InvalidArgumentError } from './InvalidArgumentError';

export enum KeyGeneratorTypes {
  ALPHANUMERIC = 'ALPHANUMERIC',
}

export class KeyGenerator {
  readonly _value: string;
  readonly _type: KeyGeneratorTypes;

  constructor(value: string, type: KeyGeneratorTypes) {
    this._value = value;
    this.ensureValueIsDefined(value);
    this.ensureIsValidType(type);
    this._type = type;
    this.ensureIsValidKey(value, type);
  }

  static random(type: KeyGeneratorTypes, len: number): KeyGenerator {
    if (!KeyGenerator.SEEDERS.hasOwnProperty(type)) {
      throw new InvalidArgumentError(`<KeyGenerator> does not allow the following type: <${type}>`);
    }

    const sourceArray = KeyGenerator.SEEDERS[type].chars.split('');
    let baselen = typeof len === 'undefined' ? sourceArray.length : len;
    const rnd = crypto.randomBytes(baselen);
    const result = [];
    let counter = 0, characterIndex, r;

    while (baselen > 0) {
      r = rnd[counter];
      characterIndex = r % sourceArray.length;
      result.push(sourceArray.splice(characterIndex, 1)[0]);
      baselen--;
      counter++;
    }

    return new KeyGenerator(result.join(''), type);
  }

  static get SEEDERS(): Record<KeyGeneratorTypes, { chars: string; pattern: string; }> {
    return {
      [KeyGeneratorTypes.ALPHANUMERIC]: {
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        pattern: '^[A-Za-z0-9]*$'
      },
    };
  }

  static get ALPHANUMERIC() {
    return 'ALPHANUMERIC';
  }

  getPatternFromType(type: KeyGeneratorTypes) {
    try {
      this.ensureIsValidType(type);
      return KeyGenerator.SEEDERS[type].pattern;
    } catch (error) {
      return undefined;
    }
  }

  ensureValueIsDefined(value: string) {
    if (value === null || value === undefined) {
      throw new InvalidArgumentError('<KeyGenerator> value must be defined');
    }
  }

  ensureIsValidKey(key: string, type: KeyGeneratorTypes) {
    const regex = new RegExp(this.getPatternFromType(type));
    if (!regex.test(key)) {
      throw new InvalidArgumentError(`<KeyGenerator> does not allow the value <${key}> for type: <${type}>`);
    }
  }

  ensureIsValidType(type: KeyGeneratorTypes) {
    if (!KeyGenerator.SEEDERS.hasOwnProperty(type)) {
      throw new InvalidArgumentError(`<KeyGenerator> does not allow the following type: <${type}>`);
    }
  }
}