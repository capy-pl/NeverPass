import aes from 'crypto-js/aes';
import cryptSHA256 from 'crypto-js/sha256';
import enc from 'crypto-js/enc-utf8';

// generate private key for user.
export function generateSecretKey(): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0].toString(16);
}

export function sha256(message: string): string {
  return cryptSHA256(message).toString();
}

export class CryptObject {
  public cipherParams: string;

  constructor(cipherParams: string) {
    this.cipherParams = cipherParams;
  }

  public static encrypt(text: string, key: string): CryptObject {
    return new CryptObject(aes.encrypt(text, key).toString());
  }

  public decrypt(key: string): string {
    const bytes = aes.decrypt(this.cipherParams, key);
    return bytes.toString(enc);
  }
}
