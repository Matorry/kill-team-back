import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpError } from '../types/http.error.js';

export type TokenPayload = JwtPayload & {
  id: string;
  userName: string;
};
export class Auth {
  static passwd = process.env.TOKEN_PASSWD!;
  static hash(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static compare(password: string, hashPasswd: string) {
    const a = bcrypt.compare(password, hashPasswd);
    return a;
  }

  static signToken(payload: TokenPayload): string {
    return jwt.sign(payload, Auth.passwd);
  }

  static verifyTokenGettingPayload(token: string) {
    try {
      const result = jwt.verify(token, Auth.passwd);
      if (typeof result === 'string') {
        throw new HttpError(498, 'Not valid token', result);
      }

      return result as TokenPayload;
    } catch (error) {
      throw new HttpError(498, 'Not valid token', (error as Error).message);
    }
  }
}
