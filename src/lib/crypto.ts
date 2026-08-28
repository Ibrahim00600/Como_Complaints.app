import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [salt, hash] = storedHash.split(':');
    const hashBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
    const storedHashBuffer = Buffer.from(hash, 'hex');
    if (hashBuffer.length !== storedHashBuffer.length) return false;
    return timingSafeEqual(hashBuffer, storedHashBuffer);
  } catch {
    return false;
  }
}
