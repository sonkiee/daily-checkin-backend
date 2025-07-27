import jwt, { JwtPayload as Payload } from "jsonwebtoken";
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

const verify = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export default { generate, verify };
