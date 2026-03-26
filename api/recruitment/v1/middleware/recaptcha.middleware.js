export const verifyRecaptcha = async (req, res, next) => {
  const secretKey = process.env.RECAPTCHA_SERVER_SITE_KEY;
  const { recaptchaToken } = req.query;

  if (!recaptchaToken) {
    return res.status(400).json({ message: "Recaptcha token is missing" });
  }
  let response;
  try {
    response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(recaptchaToken)}`,
    });

    const data = await response.json();
    const { success, score } = data;

    if (success !== true || score < 0.5) {
      return res.status(400).json({ message: "Recaptcha verification failed" });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
