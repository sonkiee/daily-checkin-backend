import jwt from "jsonwebtoken";
import "dotenv/config";

const sign = (payload: object, secret: string, options?: object): string => {
  return jwt.sign(payload, secret, options);
};

const verify = (token: string, secret: string): object | string => {
  return jwt.verify(token, secret);
};

export { sign, verify };
