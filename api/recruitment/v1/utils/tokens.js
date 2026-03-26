import jwt from "jsonwebtoken";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export function createToken(payload, expirationTime) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expirationTime || "1h",
  });
  return token;
}

export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return {
      valid: true,
      expired: false,
      payload,
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return {
        valid: false,
        expired: true,
        payload: null,
      };
    }

    return {
      valid: false,
      expired: false,
      payload: null,
    };
  }
}
