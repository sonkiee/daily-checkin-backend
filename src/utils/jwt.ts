import jwt, { JwtPayload as Payload, TokenExpiredError } from "jsonwebtoken";
import "dotenv/config";

interface JwtPayload extends Payload {
  id: string;
  deviceId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

const generate = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return {
    accessToken,
    refreshToken,
  };
};

const verify = (
  token: string
): {
  valid: boolean;
  expired: boolean;
  decoded?: JwtPayload;
} => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);

    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      return {
        valid: true,
        expired: false,
        decoded: decoded as JwtPayload,
      };
    }

    return {
      valid: false,
      expired: false,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error instanceof TokenExpiredError,
    };
  }
};

export default { generate, verify };
