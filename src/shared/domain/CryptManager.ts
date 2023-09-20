import CryptoJS from 'crypto-js';
import { InvalidArgumentError } from './InvalidArgumentError';

export class CryptManager {
  private _iv: CryptoJS.lib.WordArray;
  private _salt: CryptoJS.lib.WordArray;
  private _encryptionKey: string;

  static build() {
    return (new CryptManager)
      .generateRamdonIv()
      .generateRamdonSalt();
  }

  generateRamdonIv() {
    if (!this._iv) {
      this._iv = CryptoJS.lib.WordArray.random(128 / 8);
    }
    return this;
  }

  setIv(iv: CryptoJS.lib.WordArray) {
    this._iv = iv;
    return this;
  }

  generateRamdonSalt() {
    if (!this._salt) {
      this._salt = CryptoJS.lib.WordArray.random(128 / 8);
    }
    return this;
  }

  setSalt(salt: CryptoJS.lib.WordArray) {
    this._salt = salt;
    return this;
  }

  setEncryptionKey(encryptionKey: string) {
    this._encryptionKey = encryptionKey;
    return this;
  }

  encryptAES(plainText: string, config = { keySize: 256, iterations: 1 }) {
    this.ensureEncryptionKeyIsDefined();

    try {
      const { keySize, iterations } = config;
      const derivedKey = this.deriveEncryptionKey(keySize, iterations)
      const encrypted = CryptoJS.AES.encrypt(plainText, derivedKey, {
        iv: this._iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });

      const encryptedMessage = encrypted.toString() + this._iv.toString() + this._salt.toString();

      return encryptedMessage;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong when trying to encrypt text.';
      throw new InvalidArgumentError(errorMessage);
    }
  }

  decryptAES(encryptedMessage: string, config = { keySize: 256, iterations: 1 }) {
    this.ensureEncryptionKeyIsDefined();

    try {
      const { keySize, iterations } = config;

      const salt = CryptoJS.enc.Hex.parse(
        encryptedMessage.substr(encryptedMessage.length - 32)
      );
      this.setSalt(salt);
      console.debug(`encryptAES salt: ${salt}`);

      const iv = CryptoJS.enc.Hex.parse(
        encryptedMessage.substr(encryptedMessage.length - 64, 32)
      );
      this.setIv(iv);
      console.debug(`encryptAES iv: ${salt}`);

      const encrypted = encryptedMessage.substr(0, encryptedMessage.length - 64);
      const derivedKey = this.deriveEncryptionKey(keySize, iterations);
      const decrypted = CryptoJS.AES.decrypt(encrypted, derivedKey, {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });

      const decryptedMessage = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedMessage) {
        throw new InvalidArgumentError('<CryptManager> Cannot decrypt text.');
      }

      return decryptedMessage;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong when trying to decrypt text.';
      throw new InvalidArgumentError(errorMessage);
    }
  }

  ensureEncryptionKeyIsDefined() {
    if (!this._encryptionKey) {
      throw new InvalidArgumentError('<CryptManager> Encryption key is missing.');
    }
  }

  ensureSaltIsDefined() {
    if (!this._salt) {
      throw new InvalidArgumentError('<CryptManager> Salt is missing.');
    }
  }

  deriveEncryptionKey(keySize: number, iterations: number) {
    this.ensureEncryptionKeyIsDefined();
    this.ensureSaltIsDefined();

    return CryptoJS.PBKDF2(this._encryptionKey, this._salt, {
      keySize: keySize / 32,
      hasher: CryptoJS.algo.SHA512,
      iterations,
    });
  }
}