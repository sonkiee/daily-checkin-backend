import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

const sign = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const refresh = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "15min",
  });
};

const verify = (
  token: string
): {
  valid: boolean;
  expired: boolean;
  decoded?: JwtPayload | string;
} => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    return {
      valid: true,
      expired: false,
      decoded: decoded,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error instanceof TokenExpiredError,
    };
  }
};

export default { sign, verify, refresh };
