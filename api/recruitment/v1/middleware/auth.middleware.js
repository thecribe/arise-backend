import { verifyToken } from "../utils/tokens.js";

export const authMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  // console.log({ accessToken, refreshToken, text: "no6" });

  if (accessToken && refreshToken) {
    const decodedAccessToken = verifyToken(accessToken);

    if (decodedAccessToken.valid) {
      // Debugging log
      req.user = decodedAccessToken.payload;
      return next();
    } else {
      return res.status(401).json({
        message: decodedAccessToken.expired
          ? "ACCESS_TOKEN_EXPIRED"
          : "Verification link is invalid.",
      });
    }
  } else if (!accessToken && refreshToken) {
    return res.status(401).json({ message: "ACCESS_TOKEN_MISSING" });
  } else {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }
};
