import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

const sign = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const verify = (token: string): object | string => {
  return jwt.verify(token, JWT_SECRET as string);
};

export default { sign, verify };
