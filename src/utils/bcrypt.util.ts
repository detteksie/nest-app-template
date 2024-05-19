import { compare, genSalt, hash } from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = await genSalt(12);
  const hashed = await hash(password, salt);
  return hashed;
}

export async function comparePassword(password: string, hashedPassword: string) {
  const isMatch = await compare(password, hashedPassword);
  return isMatch;
}
