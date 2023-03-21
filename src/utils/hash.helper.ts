import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BCryptHelper {
  async hashPassword(password: string) {
    try {
      const salt = await genSalt(12);
      const hashed = await hash(password, salt);
      return hashed;
    } catch (err) {
      throw err;
    }
  }

  async comparePassword(password: string, hashedPassword: string) {
    try {
      const isMatch = await compare(password, hashedPassword);
      return isMatch;
    } catch (err) {
      throw err;
    }
  }
}
